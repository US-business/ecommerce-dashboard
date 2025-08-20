"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSession, deleteSession, verifySession } from "./session"
import bcrypt from 'bcryptjs'
import { comparePasswords, hashPassword } from "../utils"


const adminEmail = process.env.SUPER_ADMIN_EMAIL
const adminPassword = process.env.SUPER_ADMIN_PASSWORD

export interface LoginResult {
  success: boolean
  error?: string
}





/////////////////////////////////////////////////////
////////                                   //////////
////////         Login Functionality       //////////
////////                                   //////////
/////////////////////////////////////////////////////
export async function login(formData: FormData): Promise<LoginResult> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }


  try {
    //  for admin 
    if (email === adminEmail && password ===  adminPassword) {
      await createSession({
        id: 1,
        username: "admin",
        email: adminEmail,
        role: "super_admin",
      })
      return { success: true };
    }




    // Try database connection only if available
    try {
      const { db } = await import("@/lib/db")
      const { users } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")

      // const user = await db.query.users.findFirst({
      //   where: eq(users.email, email),
      // })

      const user = await db.select()
        .from(users)
        .where(eq(users.email, email))
        .then(rows => rows[0])


      if (user && await comparePasswords(password, user.password)) {
        await createSession({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        })
        return { success: true }
      }
    } catch (dbError) {
      console.log("Database not available, using demo users only")
    }

    return { success: false, error: "Invalid email or password" }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

//////////////////////////////////////////////////////////
////////                                        //////////
////////     changePassword Functionality       //////////
////////                                        //////////
//////////////////////////////////////////////////////////

export async function changePassword(formData: FormData): Promise<LoginResult> {
  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string

  if (!currentPassword || !newPassword) {
    return { success: false, error: "Current password and new password are required" }
  }

  try {
    const session = await verifySession()
    if (!session) {
      return { success: false, error: "User not authenticated" }
    }

    // Check if user exists
    const { db } = await import("@/lib/db")
    const { users } = await import("@/lib/db/schema")
    const { eq } = await import("drizzle-orm")

    const user = await db.select()
      .from(users)
      .where(eq(users.id, session.userId))
      .then(rows => rows[0])

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Verify current password
    if (!(await comparePasswords(currentPassword, user.password))) {
      return { success: false, error: "Current password is incorrect" }
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // Update user's password
    await db.update(users)
      .set({ password: hashedNewPassword })
      .where(eq(users.id, user.id))

    return { success: true }
  } catch (error) {
    console.error("Change password error:", error)
    return { success: false, error: "An error occurred while changing the password" }
  }
}

///////////////////////////////////////////////////////////
////////                                         //////////
////////        resetPassword Functionality      //////////
////////                                         //////////
///////////////////////////////////////////////////////////

export async function resetPassword(formData: FormData): Promise<LoginResult> {
  const email = formData.get("email") as string
  const newPassword = formData.get("newPassword") as string

  if (!email || !newPassword) {
    return { success: false, error: "Email and new password are required" }
  }

  try {
    // Check if user exists
    const { db } = await import("@/lib/db")
    const { users } = await import("@/lib/db/schema")
    const { eq } = await import("drizzle-orm")

    const user = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .then(rows => rows[0])

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user's password
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, user.id))

    return { success: true }
  } catch (error) {
    console.error("Reset password error:", error)
    return { success: false, error: "An error occurred while resetting the password" }
  }
}

//////////////////////////////////////////////////////////
////////                                        //////////
////////           register Functionality       //////////
////////                                        //////////
//////////////////////////////////////////////////////////

export async function register(formData: FormData): Promise<LoginResult> {
  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as "super_admin" | "viewer"

  if (!username || !email || !password || !role) {
    return { success: false, error: "All fields are required" }
  }

  try {
    // Check if user already exists
    const { db } = await import("@/lib/db")
    const { users } = await import("@/lib/db/schema")
    const { eq } = await import("drizzle-orm")

    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .then(rows => rows[0])

    if (existingUser) {
      return { success: false, error: "User already exists" }
    }

    // Validate role
    if (role !== "super_admin" && role !== "viewer") {
      return { success: false, error: "Invalid role" }
    }



    // Create new user
    const [newUser] = await db.insert(users).values({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      role,
    }).returning()

    if (!newUser) {
      return { success: false, error: "Failed to create user" }
    }


    // Create session for new user
    await createSession({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    })

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "An error occurred during registration" }
  }
}

//////////////////////////////////////////////////////////
////////                                        //////////
////////             logout Functionality       //////////
////////                                        //////////
//////////////////////////////////////////////////////////


export async function logout() {
  const session = await verifySession()
  // Redirect to signin page
  if (!session) return redirect("/")
  // Delete the session
  await deleteSession()
  // Revalidate both the home and signin paths
  revalidatePath("/")
  revalidatePath("/")

}

//////////////////////////////////////////////////////////
////////                                        //////////
////////       getCurrentUser Functionality     //////////
////////                                        //////////
//////////////////////////////////////////////////////////

export async function getCurrentUser() {
  const session = await verifySession()
  if (!session) return null

  try {
    // For admin , return session data directly
    if (session.email === adminEmail) {
      return {
        id: session.userId,
        username: session.username,
        email: session.email,
        role: session.role,
        createdAt: new Date(),
      }
    }

    // Try to get user from database if available
    try {
      const { db } = await import("@/lib/db")
      const { users } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")

      const user = await db.query.users.findFirst({
        where: eq(users.id, session.userId),
        columns: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
        },
      })

      if (user) return user
    } catch (dbError) {
      console.log("Database not available, using session data")
    }

    // Return session data as fallback
    return {
      id: session.userId,
      username: session.username,
      email: session.email,
      role: session.role,
      createdAt: new Date(),
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

//////////////////////////////////////////////////////////
////////                                        //////////
////////       requireAuth Functionality        //////////
////////                                        //////////
//////////////////////////////////////////////////////////

export async function requireAuth() {
  const session = await verifySession()
  if (!session) {
    redirect("/")
  }
  return session
}

//////////////////////////////////////////////////////////
////////                                        //////////
////////       requireSuperAdmin Functionality   //////////
////////                                        //////////
//////////////////////////////////////////////////////////

export async function requireSuperAdmin() {
  const session = await requireAuth()
  if (session.role !== "super_admin") {
    redirect("/")
  }
  return session
}

//////////////////////////////////////////////////////////
////////                                        //////////
////////         createUser Functionality       //////////
////////                                        //////////
//////////////////////////////////////////////////////////

export async function createUser(userData: {
  username: string
  email: string
  password: string
  role: "super_admin" | "viewer"
  address?: string
  phoneNumber?: string
}) {
  try {
    const { db } = await import("@/lib/db")
    const { users } = await import("@/lib/db/schema")

    const [newUser] = await db
      .insert(users)
      .values({
        ...userData,
        // password: await import("crypto").then(crypto =>
        //   crypto.subtle.digest("SHA-256", new TextEncoder().encode(userData.password))
        //     .then(hashBuffer => Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join(""))
        // ),
        password: await hashPassword(userData.password), // In production, hash this
        // password:  userData.password, // In production, hash this

      })
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
      })

    return { success: true, user: newUser }
  } catch (error) {
    console.error("Create user error:", error)
    return { success: false, error: "Failed to create user" }
  }
}
