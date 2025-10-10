# دليل إعداد مصادقة Google OAuth

## الخطوة الأولى: تثبيت المكتبات المطلوبة

```bash
npm install next-auth @next-auth/drizzle-adapter
npm install @auth/drizzle-adapter
```

## الخطوة الثانية: إنشاء مشروع في Google Cloud Console

1. اذهب إلى [Google Cloud Console](https://console.developers.google.com/)
2. إنشاء مشروع جديد أو اختيار مشروع موجود
3. تفعيل Google+ API
4. إنشاء OAuth 2.0 Client ID:
   - Application Type: Web Application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

## الخطوة الثالثة: إضافة متغيرات البيئة

في ملف `.env.local`:
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## الخطوة الرابعة: تحديث جدول المستخدمين

إضافة حقول OAuth إلى schema.ts:
```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }), // جعله اختياري للـ OAuth
  address: text("address"),
  phoneNumber: varchar("phone_number", { length: 20 }),
  role: userRoleEnum("role").notNull().default("viewer"),
  // حقول OAuth جديدة
  image: varchar("image", { length: 500 }),
  googleId: varchar("google_id", { length: 100 }),
  provider: varchar("provider", { length: 50 }).default("email"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// جداول NextAuth المطلوبة
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
})

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionToken: varchar("session_token", { length: 255 }).notNull(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
})
```

## الخطوة الخامسة: إنشاء NextAuth Configuration

إنشاء `/lib/auth/auth.config.ts`:
```typescript
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { users, accounts, sessions } from "@/lib/db/schema"

export const authConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || "viewer"
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as number
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // يمكن إضافة منطق إضافي هنا
        return true
      }
      return true
    },
  },
  pages: {
    signIn: "/signin",
    signUp: "/signup",
  },
  session: {
    strategy: "jwt" as const,
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
```

## الخطوة السادسة: إنشاء API Route

إنشاء `/app/api/auth/[...nextauth]/route.ts`:
```typescript
import { handlers } from "@/lib/auth/auth.config"

export const { GET, POST } = handlers
```

## الخطوة السابعة: تحديث صفحة تسجيل الدخول

إضافة زر Google إلى `/app/[lang]/(auth)/signin/page.tsx`:
```typescript
import { signIn } from "next-auth/react"

// إضافة زر Google
<Button
  onClick={() => signIn("google", { callbackUrl: "/" })}
  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
>
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  {dir === "rtl" ? "تسجيل الدخول بـ Google" : "Sign in with Google"}
</Button>
```

## الخطوة الثامنة: تحديث Auth Store

تحديث `/lib/stores/auth-store.ts` للتوافق مع NextAuth:
```typescript
import { useSession } from "next-auth/react"

// استخدام NextAuth session بدلاً من JWT المخصص
export const useAuthStore = create<AuthState>((set, get) => ({
  // ... باقي الكود
  
  loadUser: async () => {
    const { data: session } = useSession()
    if (session) {
      set({ 
        user: {
          id: session.user.id,
          username: session.user.name || "",
          email: session.user.email || "",
          role: session.user.role || "viewer",
          createdAt: new Date(),
        },
        isSuperAdmin: session.user.role === "super_admin",
        isViewer: session.user.role === "viewer",
        isLoading: false 
      })
    }
  },
}))
```

## الخطوة التاسعة: إضافة Session Provider

تحديث `/app/[lang]/layout.tsx`:
```typescript
import { SessionProvider } from "next-auth/react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* باقي المكونات */}
      {children}
    </SessionProvider>
  )
}
```

## الخطوة العاشرة: تحديث Middleware

تحديث `/middleware.ts` لدعم NextAuth:
```typescript
import { auth } from "@/lib/auth/auth.config"

export default auth((req) => {
  // منطق الـ middleware للغة والحماية
  // ...
})
```

## ملاحظات مهمة:

1. **الأمان**: تأكد من حفظ GOOGLE_CLIENT_SECRET بشكل آمن
2. **الإنتاج**: قم بتحديث redirect URIs للدومين الفعلي
3. **التوافق**: النظام سيدعم كلاً من Google OAuth والتسجيل التقليدي
4. **قاعدة البيانات**: قم بتشغيل migration بعد تحديث Schema

## الفوائد من هذا النهج:

✅ سهولة تسجيل الدخول للمستخدمين
✅ أمان عالي مع Google OAuth
✅ التوافق مع النظام الحالي
✅ دعم متعدد providers (يمكن إضافة Facebook, Twitter لاحقاً)
✅ إدارة جلسات محسنة
✅ تجربة مستخدم أفضل