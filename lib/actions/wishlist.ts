"use server"

import { db } from "@/lib/db"
import { wishlist, wishlistItems, products } from "@/lib/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Get user's wishlist with all items and product details
export async function getWishlistFull(userId: number) {
  try {
    // Find user's wishlist
    const userWishlist = await db.query.wishlist.findFirst({
      where: eq(wishlist.userId, userId),
      with: {
        items: {
          with: {
            product: {
              with: {
                category: true,
              },
            },
          },
          orderBy: [desc(wishlistItems.createdAt)],
        },
      },
    })

    if (!userWishlist) {
      return {
        success: true,
        data: {
          id: 0,
          userId,
          items: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }
    }

    return {
      success: true,
      data: userWishlist,
    }
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return {
      success: false,
      error: "Failed to fetch wishlist",
    }
  }
}

// Get or create user's wishlist
export async function getOrCreateWishlist(userId: number) {
  try {
    let userWishlist = await db.query.wishlist.findFirst({
      where: eq(wishlist.userId, userId),
    })

    if (!userWishlist) {
      const [newWishlist] = await db
        .insert(wishlist)
        .values({ userId })
        .returning()
      userWishlist = newWishlist
    }

    return {
      success: true,
      data: userWishlist,
    }
  } catch (error) {
    console.error("Error getting/creating wishlist:", error)
    return {
      success: false,
      error: "Failed to get or create wishlist",
    }
  }
}

// Add product to wishlist
export async function addToWishlist(userId: number, productId: number) {
  try {
    // Get or create wishlist
    const wishlistResult = await getOrCreateWishlist(userId)
    if (!wishlistResult.success || !wishlistResult.data) {
      return {
        success: false,
        error: "Failed to get wishlist",
      }
    }

    const wishlistId = wishlistResult.data.id

    // Check if product already exists in wishlist
    const existingItem = await db.query.wishlistItems.findFirst({
      where: and(
        eq(wishlistItems.wishlistId, wishlistId),
        eq(wishlistItems.productId, productId)
      ),
    })

    if (existingItem) {
      return {
        success: false,
        error: "Product already in wishlist",
      }
    }

    // Add product to wishlist
    const [newItem] = await db
      .insert(wishlistItems)
      .values({
        wishlistId,
        productId,
      })
      .returning()

    // Update wishlist timestamp
    await db
      .update(wishlist)
      .set({ updatedAt: new Date() })
      .where(eq(wishlist.id, wishlistId))

    revalidatePath("/wishlist")
    revalidatePath("/")

    return {
      success: true,
      data: newItem,
      message: "Product added to wishlist",
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return {
      success: false,
      error: "Failed to add product to wishlist",
    }
  }
}

// Remove product from wishlist
export async function removeFromWishlist(userId: number, productId: number) {
  try {
    // Get user's wishlist
    const userWishlist = await db.query.wishlist.findFirst({
      where: eq(wishlist.userId, userId),
    })

    if (!userWishlist) {
      return {
        success: false,
        error: "Wishlist not found",
      }
    }

    // Remove the item
    await db
      .delete(wishlistItems)
      .where(
        and(
          eq(wishlistItems.wishlistId, userWishlist.id),
          eq(wishlistItems.productId, productId)
        )
      )

    // Update wishlist timestamp
    await db
      .update(wishlist)
      .set({ updatedAt: new Date() })
      .where(eq(wishlist.id, userWishlist.id))

    revalidatePath("/wishlist")
    revalidatePath("/")

    return {
      success: true,
      message: "Product removed from wishlist",
    }
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return {
      success: false,
      error: "Failed to remove product from wishlist",
    }
  }
}

// Check if product is in user's wishlist
export async function isInWishlist(userId: number, productId: number) {
  try {
    const userWishlist = await db.query.wishlist.findFirst({
      where: eq(wishlist.userId, userId),
    })

    if (!userWishlist) {
      return {
        success: true,
        data: false,
      }
    }

    const item = await db.query.wishlistItems.findFirst({
      where: and(
        eq(wishlistItems.wishlistId, userWishlist.id),
        eq(wishlistItems.productId, productId)
      ),
    })

    return {
      success: true,
      data: !!item,
    }
  } catch (error) {
    console.error("Error checking wishlist:", error)
    return {
      success: false,
      error: "Failed to check wishlist",
    }
  }
}

// Get wishlist item count for user
export async function getWishlistCount(userId: number) {
  try {
    const userWishlist = await db.query.wishlist.findFirst({
      where: eq(wishlist.userId, userId),
      with: {
        items: true,
      },
    })

    return {
      success: true,
      data: userWishlist?.items.length || 0,
    }
  } catch (error) {
    console.error("Error getting wishlist count:", error)
    return {
      success: false,
      error: "Failed to get wishlist count",
      data: 0,
    }
  }
}

// Clear entire wishlist
export async function clearWishlist(userId: number) {
  try {
    const userWishlist = await db.query.wishlist.findFirst({
      where: eq(wishlist.userId, userId),
    })

    if (!userWishlist) {
      return {
        success: false,
        error: "Wishlist not found",
      }
    }

    // Delete all items
    await db
      .delete(wishlistItems)
      .where(eq(wishlistItems.wishlistId, userWishlist.id))

    // Update wishlist timestamp
    await db
      .update(wishlist)
      .set({ updatedAt: new Date() })
      .where(eq(wishlist.id, userWishlist.id))

    revalidatePath("/wishlist")

    return {
      success: true,
      message: "Wishlist cleared",
    }
  } catch (error) {
    console.error("Error clearing wishlist:", error)
    return {
      success: false,
      error: "Failed to clear wishlist",
    }
  }
}

// Move all wishlist items to cart
export async function moveWishlistToCart(userId: number) {
  try {
    const wishlistResult = await getWishlistFull(userId)
    
    if (!wishlistResult.success || !wishlistResult.data) {
      return {
        success: false,
        error: "Failed to get wishlist",
      }
    }

    const items = wishlistResult.data.items

    if (items.length === 0) {
      return {
        success: false,
        error: "Wishlist is empty",
      }
    }

    // Import cart actions
    const { addToCartAction } = await import("./cart")

    // Add each item to cart
    for (const item of items) {
      await addToCartAction(userId, item.productId, 1)
    }

    // Clear wishlist
    await clearWishlist(userId)

    revalidatePath("/wishlist")
    revalidatePath("/cart")

    return {
      success: true,
      message: "All items moved to cart",
    }
  } catch (error) {
    console.error("Error moving wishlist to cart:", error)
    return {
      success: false,
      error: "Failed to move items to cart",
    }
  }
}
