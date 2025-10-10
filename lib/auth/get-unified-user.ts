import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

/**
 * Get user from both NextAuth and custom auth systems
 * This function checks NextAuth first, then falls back to custom auth
 */
export async function getUnifiedUser() {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.email) {
      const dbUser = await db.select().from(users).where(eq(users.email, session.user.email)).then(rows => rows[0])
      if (dbUser) {
        return dbUser
      }
    }
  } catch (error) {
  }
  return null
}