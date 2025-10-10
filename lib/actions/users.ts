"use server"

import { revalidatePath } from "next/cache"
import { requireSuperAdmin } from "@/lib/auth/guards"
import { mockUsersService } from "@/lib/services/users-mock"
import { hashPassword } from "../utils"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config"

export interface UserFormData {
  username: string
  email: string
  password?: string
  address?: string
  phoneNumber?: string
  role: "super_admin" | "viewer"
}

export interface UsersResponse {
  success: boolean
  data?: any[]
  error?: string
  total?: number
}

export interface UserResponse {
  success: boolean
  data?: any
  error?: string
}



// Check if database is available
async function isDatabaseAvailable() {
  try {
    await import("@/lib/db")
    await import("@/lib/db/schema")
    return true
  } catch (error) {
    console.log("Database not available, using mock service")
    return false
  }
}

// Get all users with pagination and search (Super Admin only)
export async function getUsers(page = 1, limit = 10, search?: string): Promise<UsersResponse> {
  try {
    await requireSuperAdmin()

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      return await mockUsersService.getUsers(page, limit, search)
    }

    try {
      const { db } = await import("@/lib/db")
      const { users } = await import("@/lib/db/schema")
      const { like, or, desc } = await import("drizzle-orm")

      const offset = (page - 1) * limit

      let query: any = db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          address: users.address,
          phoneNumber: users.phoneNumber,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset)

      if (search) {
        query = query.where(
          or(
            like(users.username, `%${search}%`),
            like(users.email, `%${search}%`),
            like(users.address, `%${search}%`),
            like(users.phoneNumber, `%${search}%`),
          ),
        )
      }

      const result = await query

      // Get total count for pagination
      const totalQuery = db.select({ count: users.id }).from(users)
      if (search) {
        totalQuery.where(
          or(
            like(users.username, `%${search}%`),
            like(users.email, `%${search}%`),
            like(users.address, `%${search}%`),
            like(users.phoneNumber, `%${search}%`),
          ),
        )
      }
      const totalResult = await totalQuery
      const total = totalResult.length

      return {
        success: true,
        data: result,
        total,
      }
    } catch (dbError) {
      console.log("Database query failed, falling back to mock service")
      return await mockUsersService.getUsers(page, limit, search)
    }
  } catch (error) {
    console.error("Get users error:", error)
    return {
      success: false,
      error: "Failed to fetch users",
    }
  }
}


//////////////////////////////////////////////////////////
////////                                        //////////
////////           GET SINGLE USER              //////////
////////           Super Admin only             //////////
////////                                        //////////
//////////////////////////////////////////////////////////

export async function getUser(id: number): Promise<UserResponse> {
  try {
    await requireSuperAdmin()

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      return await mockUsersService.getUser(id)
    }

    try {
      const { db } = await import("@/lib/db")
      const { users } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")

      const result = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          address: users.address,
          phoneNumber: users.phoneNumber,
          role: users.role,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, id))
        .limit(1)

      if (result.length === 0) {
        return {
          success: false,
          error: "User not found",
        }
      }

      return {
        success: true,
        data: result[0],
      }
    } catch (dbError) {
      return await mockUsersService.getUser(id)
    }
  } catch (error) {
    console.error("Get user error:", error)
    return {
      success: false,
      error: "Failed to fetch user",
    }
  }
}

//////////////////////////////////////////////////////////
////////                                        //////////
////////           CREATE USER                  //////////
////////                                        //////////
//////////////////////////////////////////////////////////

export async function createUser(data: UserFormData): Promise<UserResponse> {
  try {
    await requireSuperAdmin()

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      const result = await mockUsersService.createUser(data)
      revalidatePath("/dashboard/users")
      return result
    }

    try {
      const { db } = await import("@/lib/db")
      const { users } = await import("@/lib/db/schema")

      const result = await db
        .insert(users)
        .values({
          username: data.username,
          email: data.email,
          password: await hashPassword(data.password as string), // In production, hash this
          address: data.address,
          phoneNumber: data.phoneNumber,
          role: data.role,
        })
        .returning({
          id: users.id,
          username: users.username,
          email: users.email,
          address: users.address,
          phoneNumber: users.phoneNumber,
          role: users.role,
          createdAt: users.createdAt,
        })

      // revalidatePath("/dashboard/users")
      redirect("/dashboard/users")


      return {
        success: true,
        data: result[0],
      }
    } catch (dbError) {
      const result = await mockUsersService.createUser(data)
      revalidatePath("/dashboard/users")
      return result
    }
  } catch (error) {
    console.error("Create user error:", error)
    return {
      success: false,
      error: "Failed to create user",
    }
  }
}

//////////////////////////////////////////////////////////
////////                                        //////////
////////           UPDATE USER                  //////////
////////                                        //////////
//////////////////////////////////////////////////////////
export async function updateUser(id: number, data: UserFormData): Promise<UserResponse> {
  try {
    await requireSuperAdmin()

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      const result = await mockUsersService.updateUser(id, data)
      revalidatePath("/dashboard/users")
      return result
    }

    try {
      const { db } = await import("@/lib/db")
      const { users } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")

      const updateData: any = {
        username: data.username,
        email: data.email,
        address: data.address,
        phoneNumber: data.phoneNumber,
        role: data.role,
        updatedAt: new Date(),
      }

      // Only update password if provided
      if (data.password) {
        updateData.password = data.password // In production, hash this
      }

      const result = await db.update(users).set(updateData).where(eq(users.id, id)).returning({
        id: users.id,
        username: users.username,
        email: users.email,
        address: users.address,
        phoneNumber: users.phoneNumber,
        role: users.role,
        createdAt: users.createdAt,
      })

      revalidatePath("/dashboard/users")

      return {
        success: true,
        data: result[0],
      }
    } catch (dbError) {
      const result = await mockUsersService.updateUser(id, data)
      revalidatePath("/dashboard/users")
      return result
    }
  } catch (error) {
    console.error("Update user error:", error)
    return {
      success: false,
      error: "Failed to update user",
    }
  }
}

// Delete user (Super Admin only)
export async function deleteUser(id: number): Promise<UserResponse> {
  try {
    await requireSuperAdmin()

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      const result = await mockUsersService.deleteUser(id)
      revalidatePath("/dashboard/users")
      return result
    }

    try {
      const { db } = await import("@/lib/db")
      const { users } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")

      const userToDelete = await db.select().from(users).where(eq(users.id, id)).limit(1)

      if (userToDelete.length === 0) {
        return {
          success: false,
          error: "User not found",
        }
      }
      if (userToDelete[0].role === "super_admin") {
        throw new Error("Cannot delete a Super Admin account.");
      }

      await db.delete(users).where(eq(users.id, id))

      revalidatePath("/dashboard/users")

      return {
        success: true,
      }
    } catch (dbError) {
      const result = await mockUsersService.deleteUser(id)
      revalidatePath("/dashboard/users")
      return result
    }
  } catch (error) {
    console.error("Delete user error:", error)
    return {
      success: false,
    }
  }
}

export async function updateProfile(data: Partial<UserFormData>): Promise<UserResponse> {
  try {
    console.log("updateProfile called with data:", data);
    const session = await getServerSession(authOptions);
    console.log("Session:", session?.user);

    if (!session || !session.user?.id) {
      console.log("No session or user ID");
      return {
        success: false,
        error: "Unauthorized - No session or user ID",
      };
    }

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      // Mock service update can be implemented here if needed
      return {
        success: false,
        error: "Database not available",
      };
    }

    try {
      const { db } = await import("@/lib/db");
      const { users } = await import("@/lib/db/schema");
      const { eq } = await import("drizzle-orm");

      const updateData: any = {
        username: data.username,
        email: data.email,
        address: data.address || null,
        phoneNumber: data.phoneNumber || null,
        updatedAt: new Date(),
      };

      console.log("Update data:", updateData);
      console.log("User ID:", session.user.id);

      // Only update password if provided
      if (data.password) {
        updateData.password = await hashPassword(data.password);
      }

      const result = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, session.user.id as number))
        .returning({
          id: users.id,
          username: users.username,
          email: users.email,
          address: users.address,
          phoneNumber: users.phoneNumber,
          role: users.role,
          createdAt: users.createdAt,
        });

      console.log("Update result:", result);
      revalidatePath("/en/account");
      revalidatePath("/ar/account");

      return {
        success: true,
        data: result[0],
      };
    } catch (dbError) {
      return {
        success: false,
        error: "Failed to update profile",
      };
    }
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      success: false,
      error: "Failed to update profile",
    };
  }
}

// Get current user (without admin requirements)
export async function getCurrentUser(): Promise<UserResponse> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Not authenticated",
      }
    }

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      return await mockUsersService.getUser(Number(session.user.id))
    }

    try {
      const { db } = await import("@/lib/db")
      const { users } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")

      const result = await db
        .select({
          id: users.id,
          username: users.username,
          email: users.email,
          image: users.image,
          address: users.address,
          phoneNumber: users.phoneNumber,
          role: users.role,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(eq(users.id, Number(session.user.id)))
        .limit(1)

      if (result.length === 0) {
        return {
          success: false,
          error: "User not found",
        }
      }

      return {
        success: true,
        data: result[0],
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
      return await mockUsersService.getUser(Number(session.user.id))
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return {
      success: false,
      error: "Failed to fetch user",
    }
  }
}

// Update profile image action
export async function updateProfileImage(imageUrl: string): Promise<UserResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "Unauthorized - No session or user ID",
      };
    }

    const dbAvailable = await isDatabaseAvailable();

    if (!dbAvailable) {
      return {
        success: false,
        error: "Database not available",
      };
    }

    try {
      const { db } = await import("@/lib/db");
      const { users } = await import("@/lib/db/schema");
      const { eq } = await import("drizzle-orm");

      const result = await db
        .update(users)
        .set({
          image: imageUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id as number))
        .returning({
          id: users.id,
          username: users.username,
          email: users.email,
          image: users.image,
          address: users.address,
          phoneNumber: users.phoneNumber,
          role: users.role,
          createdAt: users.createdAt,
        });

      revalidatePath("/en/account");
      revalidatePath("/ar/account");

      return {
        success: true,
        data: result[0],
      };
    } catch (dbError) {
      console.error("Database error updating profile image:", dbError);
      return {
        success: false,
        error: "Failed to update profile image",
      };
    }
  } catch (error) {
    console.error("Update profile image error:", error);
    return {
      success: false,
      error: "Failed to update profile image",
    };
  }
}
