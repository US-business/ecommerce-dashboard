import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, cart } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { hashPassword } from "@/lib/utils"
import {
  createAuthError,
  logAuthError,
  isValidEmail,
  isValidPassword,
  validateRequiredFields,
  AuthError
} from "@/lib/auth/errors"

export async function POST(request: Request) {
  try {
    // Parse form data
    const form = await request.formData()
    const email = String(form.get("email") || "").trim().toLowerCase()
    const username = String(form.get("username") || "").trim()
    const password = String(form.get("password") || "")
    const address = String(form.get("address") || "") || null
    const phoneNumber = String(form.get("phoneNumber") || "") || null

    // Validate required fields
    const userData = { email, username, password }
    validateRequiredFields(userData, ["email", "username", "password"])

    // Validate email format
    if (!isValidEmail(email)) {
      throw createAuthError.invalidEmail({ email })
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      throw createAuthError.invalidPassword()
    }

    // Validate username length
    if (username.length < 3) {
      throw createAuthError.validationError("Username must be at least 3 characters")
    }

    // Check if user already exists
    const existing = await db.select().from(users).where(eq(users.email, email)).then(r => r[0])
    if (existing) {
      throw createAuthError.userAlreadyExists({ email })
    }

    // Hash password
    const hashed = await hashPassword(password)

    // Create user
    const [created] = await db.insert(users).values({
      email,
      username,
      password: hashed,
      address: address || undefined,
      phoneNumber: phoneNumber || undefined,
      role: "viewer",
      provider: "email",
      emailVerified: null,
    }).returning()

    // Create cart for new user
    try {
      await db.insert(cart).values({
        userId: created.id,
        totalAmount: "0.00"
      })
    } catch (cartError) {
      logAuthError("POST /api/auth/register - cart creation", cartError, {
        userId: created.id
      })
      // Continue even if cart creation fails
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        id: created.id, 
        email: created.email, 
        username: created.username 
      } 
    })
  } catch (error) {
    if (error instanceof AuthError) {
      logAuthError("POST /api/auth/register", error)
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode }
      )
    }

    logAuthError("POST /api/auth/register", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}


