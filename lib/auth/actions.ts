"use server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { comparePasswords, hashPassword } from "../utils"
import {
  createAuthError,
  logAuthError,
  handleServerActionError,
  validateRequiredFields,
  isValidEmail,
  isValidPassword,
  AuthErrorCode
} from "./errors"

export interface ActionResult {
  success: boolean
  error?: string
  code?: AuthErrorCode
  data?: any
}

/////////////////////////////////////////////////////
////////                                   //////////
////////     Server Actions for NextAuth    //////////
////////                                   //////////
/////////////////////////////////////////////////////

/**
 * Get current authenticated user from NextAuth session
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return null
    }

    // Get full user data from database
    const user = await db.select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .then(rows => rows[0])

    if (!user) {
      logAuthError("getCurrentUser", createAuthError.userNotFound(), {
        email: session.user.email
      })
      return null
    }

    return {
      id: user.id,
      username: user.username || user.email.split('@')[0],
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      image: user.image,
      provider: user.provider
    }
  } catch (error) {
    logAuthError("getCurrentUser", error, {
      hasSession: !!await getServerSession(authOptions)
    })
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession(authOptions)
  return !!session?.user
}

/**
 * Check if user has super admin role
 */
export async function isSuperAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === "super_admin"
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  try {
    if (!email || !isValidEmail(email)) {
      throw createAuthError.invalidEmail({ email })
    }

    const user = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .then(rows => rows[0])
    
    return user || null
  } catch (error) {
    logAuthError("getUserByEmail", error, { email })
    return null
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(data: {
  username?: string
  address?: string
  phoneNumber?: string
}): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      throw createAuthError.noSession()
    }

    const user = await getUserByEmail(session.user.email)
    if (!user) {
      throw createAuthError.userNotFound({ email: session.user.email })
    }

    await db.update(users)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id))

    return { success: true }
  } catch (error) {
    return handleServerActionError("updateUserProfile", error)
  }
}

/**
 * Verify user credentials (for API routes)
 */
export async function verifyCredentials(email: string, password: string): Promise<ActionResult> {
  try {
    // Validate input
    if (!email || !password) {
      throw createAuthError.missingFields(["email", "password"])
    }

    if (!isValidEmail(email)) {
      throw createAuthError.invalidEmail({ email })
    }

    const user = await getUserByEmail(email)
    if (!user || !user.password) {
      throw createAuthError.invalidCredentials()
    }

    const isValid = await comparePasswords(password, user.password)
    if (!isValid) {
      throw createAuthError.invalidCredentials()
    }

    return { 
      success: true, 
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    }
  } catch (error) {
    return handleServerActionError("verifyCredentials", error)
  }
}

/**
 * Create a new user (admin only)
 */
export async function createUserAccount(userData: {
  username: string
  email: string
  password: string
  role: "super_admin" | "viewer"
  address?: string
  phoneNumber?: string
}): Promise<ActionResult> {
  try {
    // Validate required fields
    validateRequiredFields(userData, ["username", "email", "password", "role"])

    // Validate email format
    if (!isValidEmail(userData.email)) {
      throw createAuthError.invalidEmail({ email: userData.email })
    }

    // Validate password strength
    if (!isValidPassword(userData.password)) {
      throw createAuthError.invalidPassword()
    }

    // Check if requester is super admin
    const isAdmin = await isSuperAdmin()
    if (!isAdmin) {
      throw createAuthError.insufficientPermissions()
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email)
    if (existingUser) {
      throw createAuthError.userAlreadyExists({ email: userData.email })
    }

    // Create new user
    const [newUser] = await db.insert(users).values({
      ...userData,
      password: await hashPassword(userData.password),
      provider: "email"
    }).returning({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role
    })

    return { success: true, data: newUser }
  } catch (error) {
    return handleServerActionError("createUserAccount", error)
  }
}

/**
 * Delete user account (admin only)
 */
export async function deleteUserAccount(userId: number): Promise<ActionResult> {
  try {
    if (!userId || typeof userId !== "number") {
      throw createAuthError.validationError("Invalid user ID")
    }

    const isAdmin = await isSuperAdmin()
    if (!isAdmin) {
      throw createAuthError.insufficientPermissions()
    }

    // Check if user exists
    const userToDelete = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .then(rows => rows[0])

    if (!userToDelete) {
      throw createAuthError.userNotFound({ userId })
    }

    await db.delete(users).where(eq(users.id, userId))
    return { success: true }
  } catch (error) {
    return handleServerActionError("deleteUserAccount", error)
  }
}
