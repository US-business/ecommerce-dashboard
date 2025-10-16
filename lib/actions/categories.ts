"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth/guards"
import { mockCategoriesService } from "@/lib/services/categories-mock"
import type { Category, CategoryFormData } from "@/types/category"

export interface CategoriesResponse {
  success: boolean
  data?: Category[]
  error?: string
  total?: number
}

export interface CategoryResponse {
  success: boolean
  data?: Category
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

// Get all categories with pagination and search
export async function getCategories(page = 1, limit = 10, search?: string , searchFirstName = false): Promise<CategoriesResponse> {
  try {
    // await requireAuth()

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      return await mockCategoriesService.getCategories(page, limit, search)
    }

    try {
      const { db } = await import("@/lib/db")
      const { categories } = await import("@/lib/db/schema")
      const { like, or, desc } = await import("drizzle-orm")

      const offset = (page - 1) * limit

      let query = db.select().from(categories).orderBy(desc(categories.createdAt)).limit(limit).offset(offset)


      const searchCondition = search
      ? searchFirstName === false ? or(
        like(categories.nameEn, `%${search}%`),
        like(categories.nameAr, `%${search}%`),
        like(categories.slug, `%${search}%`),
      ) : or(
        like(categories.nameEn, `${search}%`),
        like(categories.nameAr, `${search}%`),
        like(categories.slug, `${search}%`),
      )
      : undefined


      if (search) query = query.where(searchCondition) as any

      const result = await query

      // Get total count for pagination
      const totalQuery = db.select({ count: categories.id }).from(categories)

      if (search) totalQuery.where(searchCondition)

      const totalResult = await totalQuery
      const total = totalResult.length

      return {
        success: true,
        data: result.map(cat => ({
          ...cat,
          image: cat.image ?? undefined,
          createdAt: cat.createdAt ?? new Date(),
          updatedAt: cat.updatedAt ?? undefined,
        })),
        total,
      }
    } catch (dbError) {
      console.log("Database query failed, falling back to mock service")
      return await mockCategoriesService.getCategories(page, limit, search)
    }
  } catch (error) {
    console.error("Get categories error:", error)
    return {
      success: false,
      error: "Failed to fetch categories",
    }
  }
}

// Get single category by ID
export async function getCategory(id: number): Promise<CategoryResponse> {
  try {
    // await requireAuth()

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      return await mockCategoriesService.getCategory(id)
    }

    try {
      const { db } = await import("@/lib/db")
      const { categories } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")

      const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1)

      if (result.length === 0) {
        return {
          success: false,
          error: "Category not found",
        }
      }

      return {
        success: true,
        data: {
          ...result[0],
          image: result[0].image ?? undefined,
          createdAt: result[0].createdAt ?? new Date(),
          updatedAt: result[0].updatedAt ?? undefined,
        },
      }
    } catch (dbError) {
      return await mockCategoriesService.getCategory(id)
    }
  } catch (error) {
    console.error("Get category error:", error)
    return {
      success: false,
      error: "Failed to fetch category",
    }
  }
}

// Create new category
export async function createCategory(data: CategoryFormData): Promise<CategoryResponse> {
  try {
    await requireAuth()

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      const result = await mockCategoriesService.createCategory(data)
      revalidatePath("/dashboard/categories")
      return result
    }

    try {
      const { db } = await import("@/lib/db")
      const { categories } = await import("@/lib/db/schema")

      const result = await db
        .insert(categories)
        .values({
          nameEn: data.nameEn,
          nameAr: data.nameAr,
          slug: data.slug,
          image: data.image,
        })
        .returning()

      revalidatePath("/dashboard/categories")

      return {
        success: true,
        data: {
          ...result[0],
          image: result[0].image ?? undefined,
          createdAt: result[0].createdAt ?? new Date(),
          updatedAt: result[0].updatedAt ?? undefined,
        },
      }
    } catch (dbError) {
      const result = await mockCategoriesService.createCategory(data)
      revalidatePath("/dashboard/categories")
      return result
    }
  } catch (error) {
    console.error("Create category error:", error)
    return {
      success: false,
      error: "Failed to create category",
    }
  }
}

// Update category
export async function updateCategory(id: number, data: CategoryFormData): Promise<CategoryResponse> {
  try {
    await requireAuth()

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      const result = await mockCategoriesService.updateCategory(id, data)
      revalidatePath("/dashboard/categories")
      return result
    }

    try {
      const { db } = await import("@/lib/db")
      const { categories } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")

      const result = await db
        .update(categories)
        .set({
          nameEn: data.nameEn,
          nameAr: data.nameAr,
          slug: data.slug,
          image: data.image,
          updatedAt: new Date(),
        })
        .where(eq(categories.id, id))
        .returning()

      revalidatePath("/dashboard/categories")

      return {
        success: true,
        data: {
          ...result[0],
          image: result[0].image ?? undefined,
          createdAt: result[0].createdAt ?? new Date(),
          updatedAt: result[0].updatedAt ?? undefined,
        },
      }
    } catch (dbError) {
      const result = await mockCategoriesService.updateCategory(id, data)
      revalidatePath("/dashboard/categories")
      return result
    }
  } catch (error) {
    console.error("Update category error:", error)
    return {
      success: false,
      error: "Failed to update category",
    }
  }
}


// Delete category
export async function deleteCategory(id: number): Promise<CategoryResponse> {
  try {
    await requireAuth()

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      const result = await mockCategoriesService.deleteCategory(id)
      revalidatePath("/dashboard/categories")
      return result
    }

    try {
      const { db } = await import("@/lib/db")
      const { categories } = await import("@/lib/db/schema")
      const { eq } = await import("drizzle-orm")

      await db.delete(categories).where(eq(categories.id, id))

      revalidatePath("/dashboard/categories")

      return {
        success: true,
      }
    } catch (dbError) {
      const result = await mockCategoriesService.deleteCategory(id)
      revalidatePath("/dashboard/categories")
      return result
    }
  } catch (error) {
    console.error("Delete category error:", error)
    return {
      success: false,
      error: "Failed to delete category",
    }
  }
}
