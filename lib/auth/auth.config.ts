import type { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import { users, accounts, sessions, verificationTokens, cart } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { env, isDevelopment } from "@/lib/config/env"
import { logAuthError } from "./errors"




export const authOptions: AuthOptions = {
  // تم إزالة DrizzleAdapter لحل مشاكل التوافق
  // سيتم التعامل مع قاعدة البيانات يدوياً في callbacks
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline", 
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          logAuthError("CredentialsProvider.authorize", new Error("Missing credentials"), {
            hasEmail: !!credentials?.email,
            hasPassword: !!credentials?.password
          })
          return null
        }
        try {
          const dbUser = await db.select().from(users).where(eq(users.email, credentials.email)).then(rows => rows[0])
          if (!dbUser || !dbUser.password) {
            logAuthError("CredentialsProvider.authorize", new Error("User not found or no password"), {
              email: credentials.email,
              userExists: !!dbUser,
              hasPassword: !!dbUser?.password
            })
            return null
          }
          const { comparePasswords } = await import("@/lib/utils")
          const valid = await comparePasswords(credentials.password, dbUser.password)
          if (!valid) {
            logAuthError("CredentialsProvider.authorize", new Error("Invalid password"), {
              email: credentials.email
            })
            return null
          }
          return {
            id: String(dbUser.id), // تحويل إلى string لتوافق NextAuth
            email: dbUser.email,
            name: dbUser.username || dbUser.email.split('@')[0],
            image: dbUser.image ?? undefined,
          } as any
        } catch (error) {
          logAuthError("CredentialsProvider.authorize", error, {
            email: credentials.email
          })
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      
      // Persist the OAuth access_token and/or the user id to the token right after signin
      if (account && user && user.email) {
        try {
          const dbUser = await db.select().from(users).where(eq(users.email, user.email)).then(rows => rows[0])
          if (dbUser) {
            token.role = dbUser.role
            token.id = dbUser.id
            token.username = dbUser.username || user.name || user.email?.split('@')[0]
            token.email = dbUser.email
          } else {
            token.email = user.email
            token.username = user.name || user.email?.split('@')[0]
            token.role = "viewer" // default role
            // Note: id will be undefined for users not in database 
          }
        } catch (error) {
          logAuthError("jwt callback", error, {
            hasUser: !!user,
            hasAccount: !!account,
            userEmail: user?.email
          })
          // Use user data from OAuth as fallback
          token.email = user.email
          token.username = user.name || user.email?.split('@')[0]
          token.role = "viewer"
        }
      }
      
      // For existing tokens, ensure we have the data
      if (!account && token.email && !token.id) {
        try {
          const dbUser = await db.select().from(users).where(eq(users.email, token.email as string)).then(rows => rows[0])
          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role
            token.username = dbUser.username || token.username
          }
        } catch (error) {
          logAuthError("jwt callback - token refresh", error, {
            tokenEmail: token.email,
            hasId: !!token.id
          })
        }
      }
      
      return token
    },
    async session({ session, token }) { 
      
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.id as number
        session.user.role = (token.role as "super_admin" | "viewer") || "viewer"
        session.user.username = (token.username as string) || session.user.name || "User"
        session.user.email = (token.email as string) || session.user.email || ""
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          if (!user.email) {
            return false
          }
          
          // فحص إذا كان المستخدم موجود
          const existingUser = await db.select()
            .from(users)
            .where(eq(users.email, user.email))
            .then(rows => rows[0])
          
          if (existingUser) {
            return true // مستخدم موجود، السماح بالدخول
          }
          
          // إنشاء مستخدم جديد
          const [newUser] = await db.insert(users).values({
            email: user.email,
            username: user.name || user.email?.split('@')[0] || "User",
            image: user.image,
            googleId: account.providerAccountId,
            provider: "google",
            emailVerified: new Date(),
            role: "viewer",
          }).returning()
          
          // إنشاء سجل الحساب (accounts)
          await db.insert(accounts).values({
            userId: newUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refresh_token,
            access_token: account.access_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state,
          })
          
          // إنشاء سلة تسوق للمستخدم الجديد
          await db.insert(cart).values({ 
            userId: newUser.id,
            totalAmount: "0.00"
          })
          
          return true
        } catch (error) {
          logAuthError("signIn callback - Google", error, {
            userEmail: user.email,
            providerId: account.providerAccountId
          })
          return false
        }
      }
      
      return true
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`
        return redirectUrl
      }

      // Allows callback URLs on the same origin
      if (url.startsWith(baseUrl)) {
        return url
      }

      // Respect provided callbackUrl (relative or absolute)
      try {
        const parsed = new URL(url, baseUrl)
        if (parsed.origin === baseUrl) {
          return parsed.toString()
        }
      } catch (error) {
        logAuthError("redirect callback", error, {
          url,
          baseUrl
        })
      }

      // Default to Arabic home as app default locale
      const fallback = `${baseUrl}/ar`
      return fallback
    }
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 60 * 60 * 24 * 30,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  debug: isDevelopment,
}
