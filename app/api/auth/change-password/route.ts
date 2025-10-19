import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { comparePasswords, hashPassword } from "@/lib/utils"
import {
  createAuthError,
  logAuthError,
  isValidPassword,
  AuthError
} from "@/lib/auth/errors"

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      throw createAuthError.unauthorized()
    }

    // Parse form data
    const form = await request.formData()
    const currentPassword = String(form.get("currentPassword") || "")
    const newPassword = String(form.get("newPassword") || "")

    // Validate input
    if (!currentPassword || !newPassword) {
      throw createAuthError.missingFields(["currentPassword", "newPassword"])
    }

    // Validate new password strength
    if (!isValidPassword(newPassword)) {
      throw createAuthError.invalidPassword()
    }

    // Check if passwords are the same
    if (currentPassword === newPassword) {
      throw createAuthError.validationError("New password must be different from current password")
    }

    // Get user from database
    const user = await db.select().from(users).where(eq(users.email, session.user.email)).then(r => r[0])
    if (!user || !user.password) {
      throw createAuthError.validationError("No local password set. Please use OAuth provider to sign in.")
    }

    // Verify current password
    const valid = await comparePasswords(currentPassword, user.password)
    if (!valid) {
      throw createAuthError.validationError("Current password is incorrect")
    }

    // Hash and update password
    const hashed = await hashPassword(newPassword)
    await db.update(users).set({ 
      password: hashed,
      updatedAt: new Date()
    }).where(eq(users.id, user.id))

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof AuthError) {
      logAuthError("POST /api/auth/change-password", error)
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode }
      )
    }

    logAuthError("POST /api/auth/change-password", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}


