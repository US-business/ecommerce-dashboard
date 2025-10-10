"use server"

import { revalidatePath } from "next/cache"
import { requireSuperAdmin } from "@/lib/auth/guards"
import { mockCouponsService } from "@/lib/services/coupons-mock"
import { type Coupon } from "@/lib/stores/coupons-store"

export interface CreateCouponInput {
  code: string
  isActive: boolean
  discountType: "fixed" | "percentage"
  discountValue: number
  validFrom?: string | Date | null
  validTo?: string | Date | null
}

// Back-compat for UI import
export type CouponFormData = CreateCouponInput

export interface CouponsResponse {
  success: boolean
  data?: any[]
  error?: string
  total?: number
}

export interface CouponResponse {
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

export async function getAllCoupons(): Promise<CouponsResponse> {
  try {
    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
        return await mockCouponsService.getCoupons(1, 10)
    }
  
    try {
      const { db } = await import("@/lib/db")
      const { coupons } = await import("@/lib/db/schema")

      const result = await db.select().from(coupons)

      return {
        success: true,
        data: result,
      }
    } catch (dbError) {
        console.log("Database query failed, falling back to mock service")
        return await mockCouponsService.getCoupons(1, 10)
      }
  } catch (error) {
    console.error("Get all coupons error:", error)
    return {
      success: false,
      error: "Failed to fetch coupons",
    }
  }
}

// Get all coupons with pagination and search (Super Admin only)
export async function getCoupons(page = 1, limit = 10, search?: string): Promise<CouponsResponse> {
    try {
      await requireSuperAdmin()

      const dbAvailable = await isDatabaseAvailable()

      if (!dbAvailable) {
        return await mockCouponsService.getCoupons(page, limit, search)
      }

      try {
        const { db } = await import("@/lib/db")
        const { coupons } = await import("@/lib/db/schema")
        const { like, or, desc } = await import("drizzle-orm")

        const offset = (page - 1) * limit

        const baseQuery = {
          where: search ? or(like(coupons.code, `%${search}%`), like(coupons.discountType, `%${search}%`)) : undefined,
        }

        const query = db.select()
          .from(coupons)
          .where(baseQuery.where)
          .orderBy(desc(coupons.createdAt))
          .limit(limit)
          .offset(offset)

        const result = await query

        // Get total count for pagination
        const totalQuery = db.select({ count: coupons.id }).from(coupons)
        if (search) {
          totalQuery.where(or(like(coupons.code, `%${search}%`), like(coupons.discountType, `%${search}%`)))
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
        return await mockCouponsService.getCoupons(page, limit, search)
      }
    } catch (error) {
      console.error("Get coupons error:", error)
      return {
        success: false,
        error: "Failed to fetch coupons",
      }
    }
  }

  // Get single coupon by ID (Super Admin only)
  export async function getCoupon(id: number): Promise<CouponResponse> {
    try {
      await requireSuperAdmin()

      const dbAvailable = await isDatabaseAvailable()

      if (!dbAvailable) {
        return await mockCouponsService.getCoupon(id)
      }

      try {
        const { db } = await import("@/lib/db")
        const { coupons } = await import("@/lib/db/schema")
        const { eq } = await import("drizzle-orm")

        const result = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1)

        if (result.length === 0) {
          return {
            success: false,
            error: "Coupon not found",
          }
        }

        return {
          success: true,
          data: result[0],
        }
      } catch (dbError) {
        return await mockCouponsService.getCoupon(id)
      }
    } catch (error) {
      console.error("Get coupon error:", error)
      return {
        success: false,
        error: "Failed to fetch coupon",
      }
    }
  }

  // Create new coupon (Super Admin only)
  export async function createCoupon(data: CreateCouponInput): Promise<CouponResponse> {
    try {
      await requireSuperAdmin()

      const dbAvailable = await isDatabaseAvailable()

      if (!dbAvailable) {
        const result = await mockCouponsService.createCoupon(data)
        revalidatePath("/dashboard/coupons")
        return result
      }

      try {
        const { db } = await import("@/lib/db")
        const { coupons } = await import("@/lib/db/schema")

        // Normalize date values
        const validFrom = data.validFrom ? new Date(data.validFrom) : null
        const validTo = data.validTo ? new Date(data.validTo) : null

        const result = await db
          .insert(coupons)
          .values({
            code: data.code.toUpperCase(),
            isActive: data.isActive,
            discountType: data.discountType,
            discountValue: data.discountValue.toString(),
            validFrom: validFrom ?? undefined,
            validTo: validTo ?? undefined,
          })
          .returning()

        revalidatePath("/dashboard/coupons")

        return {
          success: true,
          data: result[0],
        }
      } catch (dbError) {
        const result = await mockCouponsService.createCoupon(data)
        revalidatePath("/dashboard/coupons")
        return result
      }
    } catch (error) {
      console.error("Create coupon error:", error)
      return {
        success: false,
        error: "Failed to create coupon",
      }
    }
  }

  // Update coupon (Super Admin only)
  export async function updateCoupon(id: number, data: CreateCouponInput): Promise<CouponResponse> {
    try {
      await requireSuperAdmin()

      const dbAvailable = await isDatabaseAvailable()

      if (!dbAvailable) {
        const result = await mockCouponsService.updateCoupon(id, data)
        revalidatePath("/dashboard/coupons")
        return result
      }

      try {
        const { db } = await import("@/lib/db")
        const { coupons } = await import("@/lib/db/schema")
        const { eq } = await import("drizzle-orm")

        // Normalize date values
        const validFrom = data.validFrom ? new Date(data.validFrom) : null
        const validTo = data.validTo ? new Date(data.validTo) : null

        const result = await db
          .update(coupons)
          .set({
            code: data.code.toUpperCase(),
            isActive: data.isActive,
            discountType: data.discountType,
            discountValue: data.discountValue.toString(),
            validFrom: validFrom ?? undefined,
            validTo: validTo ?? undefined,
            updatedAt: new Date(),
          })
          .where(eq(coupons.id, id))
          .returning()

        revalidatePath("/dashboard/coupons")

        return {
          success: true,
          data: result[0],
        }
      } catch (dbError) {
        const result = await mockCouponsService.updateCoupon(id, data)
        revalidatePath("/dashboard/coupons")
        return result
      }
    } catch (error) {
      console.error("Update coupon error:", error)
      return {
        success: false,
        error: "Failed to update coupon",
      }
    }
  }

  // Delete coupon (Super Admin only)
  export async function deleteCoupon(id: number): Promise<CouponResponse> {
    try {
      await requireSuperAdmin()

      const dbAvailable = await isDatabaseAvailable()

      if (!dbAvailable) {
        const result = await mockCouponsService.deleteCoupon(id)
        revalidatePath("/dashboard/coupons")
        return result
      }

      try {
        const { db } = await import("@/lib/db")
        const { coupons } = await import("@/lib/db/schema")
        const { eq } = await import("drizzle-orm")

        await db.delete(coupons).where(eq(coupons.id, id))

        revalidatePath("/dashboard/coupons")

        return {
          success: true,
        }
      } catch (dbError) {
        const result = await mockCouponsService.deleteCoupon(id)
        revalidatePath("/dashboard/coupons")
        return result
      }
    } catch (error) {
      console.error("Delete coupon error:", error)
      return {
        success: false,
        error: "Failed to delete coupon",
      }
    }
  }
