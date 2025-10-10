"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config"

export interface ReviewResponse {
  success: boolean
  data?: any
  error?: string
}

export interface ReviewsResponse {
  success: boolean
  data?: any[]
  error?: string
  averageRating?: number
  totalReviews?: number
}

// Check if database is available
async function isDatabaseAvailable() {
  try {
    await import("@/lib/db")
    await import("@/lib/db/schema")
    return true
  } catch (error) {
    console.warn("Database not available")
    return false
  }
}

/**
 * Get all reviews for a product
 */
export async function getProductReviews(productId: number): Promise<ReviewsResponse> {
  try {
    const dbAvailable = await isDatabaseAvailable()
    if (!dbAvailable) {
      return {
        success: false,
        error: "Database not available",
      }
    }

    const { db } = await import("@/lib/db")
    const { reviews, users } = await import("@/lib/db/schema")
    const { eq, desc, avg, count } = await import("drizzle-orm")

    // Get reviews with user information
    const productReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        user: {
          id: users.id,
          username: users.username,
          email: users.email,
          image: users.image,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt))

    // Calculate average rating
    const stats = await db
      .select({
        avgRating: avg(reviews.rating),
        totalReviews: count(),
      })
      .from(reviews)
      .where(eq(reviews.productId, productId))

    const averageRating = stats[0]?.avgRating ? Number(stats[0].avgRating) : 0
    const totalReviews = stats[0]?.totalReviews || 0

    return {
      success: true,
      data: productReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews,
    }
  } catch (error) {
    console.error("Get product reviews error:", error)
    return {
      success: false,
      error: "Failed to fetch reviews",
    }
  }
}

/**
 * Add a new review
 */
export async function addReview(
  productId: number,
  rating: number,
  comment?: string
): Promise<ReviewResponse> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "You must be logged in to add a review",
      }
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return {
        success: false,
        error: "Rating must be between 1 and 5",
      }
    }

    const dbAvailable = await isDatabaseAvailable()
    if (!dbAvailable) {
      return {
        success: false,
        error: "Database not available",
      }
    }

    const { db } = await import("@/lib/db")
    const { reviews } = await import("@/lib/db/schema")
    const { eq, and } = await import("drizzle-orm")

    // Check if user already reviewed this product
    const existingReview = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.productId, productId),
          eq(reviews.userId, session.user.id)
        )
      )
      .limit(1)

    if (existingReview.length > 0) {
      return {
        success: false,
        error: "You have already reviewed this product",
      }
    }

    // Add review
    const [newReview] = await db
      .insert(reviews)
      .values({
        productId,
        userId: session.user.id,
        rating,
        comment: comment || null,
      })
      .returning()

    // Revalidate product page
    revalidatePath(`/product/${productId}`)

    return {
      success: true,
      data: newReview,
    }
  } catch (error) {
    console.error("Add review error:", error)
    return {
      success: false,
      error: "Failed to add review",
    }
  }
}

/**
 * Update a review
 */
export async function updateReview(
  reviewId: number,
  rating: number,
  comment?: string
): Promise<ReviewResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "You must be logged in to update a review",
      }
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return {
        success: false,
        error: "Rating must be between 1 and 5",
      }
    }

    const dbAvailable = await isDatabaseAvailable()
    if (!dbAvailable) {
      return {
        success: false,
        error: "Database not available",
      }
    }

    const { db } = await import("@/lib/db")
    const { reviews } = await import("@/lib/db/schema")
    const { eq, and } = await import("drizzle-orm")

    // Check if review exists and belongs to user
    const existingReview = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.id, reviewId),
          eq(reviews.userId, session.user.id)
        )
      )
      .limit(1)

    if (existingReview.length === 0) {
      return {
        success: false,
        error: "Review not found or you don't have permission to update it",
      }
    }

    // Update review
    const [updatedReview] = await db
      .update(reviews)
      .set({
        rating,
        comment: comment || null,
      })
      .where(eq(reviews.id, reviewId))
      .returning()

    // Revalidate product page
    revalidatePath(`/product/${existingReview[0].productId}`)

    return {
      success: true,
      data: updatedReview,
    }
  } catch (error) {
    console.error("Update review error:", error)
    return {
      success: false,
      error: "Failed to update review",
    }
  }
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: number): Promise<ReviewResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return {
        success: false,
        error: "You must be logged in to delete a review",
      }
    }

    const dbAvailable = await isDatabaseAvailable()
    if (!dbAvailable) {
      return {
        success: false,
        error: "Database not available",
      }
    }

    const { db } = await import("@/lib/db")
    const { reviews } = await import("@/lib/db/schema")
    const { eq, and } = await import("drizzle-orm")

    // Check if review exists and belongs to user
    const existingReview = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.id, reviewId),
          eq(reviews.userId, session.user.id)
        )
      )
      .limit(1)

    if (existingReview.length === 0) {
      return {
        success: false,
        error: "Review not found or you don't have permission to delete it",
      }
    }

    // Delete review
    await db.delete(reviews).where(eq(reviews.id, reviewId))

    // Revalidate product page
    revalidatePath(`/product/${existingReview[0].productId}`)

    return {
      success: true,
      data: { id: reviewId },
    }
  } catch (error) {
    console.error("Delete review error:", error)
    return {
      success: false,
      error: "Failed to delete review",
    }
  }
}

/**
 * Check if user has reviewed a product
 */
export async function hasUserReviewedProduct(
  productId: number
): Promise<ReviewResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return {
        success: true,
        data: { hasReviewed: false },
      }
    }

    const dbAvailable = await isDatabaseAvailable()
    if (!dbAvailable) {
      return {
        success: false,
        error: "Database not available",
      }
    }

    const { db } = await import("@/lib/db")
    const { reviews } = await import("@/lib/db/schema")
    const { eq, and } = await import("drizzle-orm")

    const existingReview = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.productId, productId),
          eq(reviews.userId, session.user.id)
        )
      )
      .limit(1)

    return {
      success: true,
      data: {
        hasReviewed: existingReview.length > 0,
        review: existingReview[0] || null,
      },
    }
  } catch (error) {
    console.error("Check user review error:", error)
    return {
      success: false,
      error: "Failed to check review status",
    }
  }
}
