"use server"

import { db } from "@/lib/db/index"
import { cart, cartItems, coupons, users, products } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"


function toNumber(value: string | number | null | undefined): number {
    if (typeof value === "number") return value
    if (typeof value === "string") return parseFloat(value)
    return 0
}


// 🟢 إنشاء كارت جديد للمستخدم
export async function createCart(userId: number) {
    try {
        console.log('createCart called for user:', userId);
        
        // First verify the user exists
        const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
        if (!user) {
            console.error('User not found:', userId);
            return { success: false, error: "User not found" }
        }

        console.log('User found, creating cart...');
        const [newCart] = await db
            .insert(cart)
            .values({
                userId,
                totalAmount: "0",
            })
            .returning()
        
        console.log('Cart created successfully:', newCart);
        return { success: true, data: newCart }
    } catch (error) {
        console.error("Error creating cart:", error)
        return { success: false, error: "Failed to create cart" }
    }
}

// 🟢 جلب الكارت مع العناصر والمنتجات
export async function getCartFull(userId: number) {
    try {
        console.log('getCartFull called for user:', userId);
        
        const result = await db.query.cart.findFirst({
            where: eq(cart.userId, userId),
            with: {
                items: {
                    with: {
                        product: true,
                    },
                },
                coupon: true,
            },
        })

        console.log('getCartFull result:', result);
        
        if (!result) {
            console.log('No cart found for user:', userId);
            return { success: true, data: null, message: "Cart not found" }
        }

        console.log('Cart found with items:', result.items?.length || 0);
        return { success: true, data: result }
    } catch (error) {
        console.error("Error fetching cart:", error)
        return { success: false, error: "Failed to fetch cart" }
    }
}

export async function addToCartAction(userId: number, productId: number, quantity: number) {
    try {
        console.log('addToCartAction called with:', { userId, productId, quantity });
        
        // التحقق من وجود المستخدم أولاً
        const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
        if (!user) {
            console.error('User not found:', userId);
            return { success: false, error: "User not found" };
        }

        // التحقق من وجود المنتج
        const product = await db.query.products.findFirst({ where: eq(products.id, productId) });
        if (!product) {
            console.error('Product not found:', productId);
            return { success: false, error: "Product not found" };
        }

        // شوف هل فيه كارت موجود ولا لأ
        let [userCart] = await db.select().from(cart).where(eq(cart.userId, userId));

        if (!userCart) {
            // استخدم createCart للتحقق من وجود المستخدم أولاً ثم إنشاء الكارت
            const res = await createCart(userId)
            if (!res.success || !res.data) {
                return { success: false, error: res.error ?? "Failed to create cart" }
            }
            userCart = res.data
        }

        // شوف المنتج موجود قبل كده في cart_items
        let [existing] = await db
            .select()
            .from(cartItems)
            .where(
                and(eq(cartItems.cartId, userCart.id), eq(cartItems.productId, productId))
            );

        let item;
        if (existing) {
            console.log('Updating existing cart item:', existing.id);
            [item] = await db
                .update(cartItems)
                .set({ quantity: existing.quantity + quantity })
                .where(eq(cartItems.id, existing.id))
                .returning();
            console.log('Updated cart item:', item);
        } else {
            console.log('Creating new cart item for cart:', userCart.id, 'product:', productId);
            [item] = await db
                .insert(cartItems)
                .values({
                    cartId: userCart.id,
                    productId,
                    quantity,
                })
                .returning();
            console.log('Created cart item:', item);
        }

        // Verify the item was actually saved
        const verifyItem = await db.query.cartItems.findFirst({
            where: eq(cartItems.id, item.id),
            with: { product: true }
        });
        console.log('Verified cart item from DB:', verifyItem);

        return { success: true, data: item };
    } catch (err) {
        console.error("Error addToCartAction:", err);
        return { success: false, error: "Failed to add item to cart" };
    }
}




// 🟢 إضافة منتج للكارت أو زيادة الكمية لو موجود
// export async function addToCartAction(userId: number, productId: number, qty: number = 1) {
//     try {
//         // First verify the user exists
//         const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
//         if (!user) {
//             return { success: false, error: "User not found" }
//         }

//         let userCart = await db.query.cart.findFirst({ where: eq(cart.userId, userId) })

//         if (!userCart) {
//             const res = await createCart(userId)
//             if (!res.success) return res
//             userCart = res.data!
//         }

//         const existingItem = await db.query.cartItems.findFirst({
//             where: and(eq(cartItems.cartId, userCart.id), eq(cartItems.productId, productId)),
//         })

//         if (existingItem) {
//             await db
//                 .update(cartItems)
//                 .set({ quantity: existingItem.quantity + qty })
//                 .where(eq(cartItems.id, existingItem.id))
//         } else {
//             await db.insert(cartItems).values({
//                 cartId: userCart.id,
//                 productId,
//                 quantity: qty,
//             })
//         }

//         return await recalcCartTotal(userCart.id)
//     } catch (error) {
//         console.error("Error adding to cart:", error)
//         return { success: false, error: "Failed to add to cart" }
//     }
// }

// 🟢 تحديث كمية منتج معين
export async function updateCartItem(cartItemId: number, qty: number) {
    try {
        const [updated] = await db
            .update(cartItems)
            .set({ quantity: qty })
            .where(eq(cartItems.id, cartItemId))
            .returning()
        // If nothing was updated, the cart item might not exist
        if (!updated) {
            return { success: false, error: "Cart item not found" }
        }

        return await recalcCartTotal(updated.cartId)
    } catch (error) {
        console.error("Error updating cart item:", error)
        return { success: false, error: "Failed to update cart item" }
    }
}

// 🟢 إزالة منتج من الكارت
export async function removeCartItem(cartItemId: number) {
    try {
        // Fetch the item first to get cartId reliably (returning() can be empty on some drivers)
        const existing = await db.query.cartItems.findFirst({
            where: eq(cartItems.id, cartItemId),
        })

        if (!existing) {
            return { success: false, error: "Cart item not found" }
        }

        await db
            .delete(cartItems)
            .where(eq(cartItems.id, cartItemId))

        return await recalcCartTotal(existing.cartId)
    } catch (error) {
        console.error("Error removing cart item:", error)
        return { success: false, error: "Failed to remove cart item" }
    }
}

// 🟢 تطبيق كوبون على الكارت
export async function applyCouponAction(cartId: number, code: string) {
    try {
        console.log('Applying coupon:', code, 'to cart:', cartId)
        
        const coupon = await db.query.coupons.findFirst({ where: eq(coupons.code, code.toUpperCase()) })
        if (!coupon || !coupon.isActive) {
            console.log('Coupon not found or inactive:', code)
            return { success: false, error: "Invalid or inactive coupon" }
        }

        // Validate coupon validity window
        const now = new Date()
        const startsOk = !coupon.validFrom || new Date(coupon.validFrom as unknown as string | Date) <= now
        const endsOk = !coupon.validTo || now <= new Date(coupon.validTo as unknown as string | Date)
        if (!startsOk || !endsOk) {
            console.log('Coupon outside validity window:', code, { validFrom: coupon.validFrom, validTo: coupon.validTo })
            return { success: false, error: "Coupon is expired or not yet valid" }
        }

        console.log('Found coupon:', coupon)
        
        const [updatedCart] = await db.update(cart).set({ couponId: coupon.id }).where(eq(cart.id, cartId)).returning()
        console.log('Updated cart with coupon:', updatedCart)
        
        return await recalcCartTotal(cartId)
    } catch (error) {
        console.error("Error applying coupon:", error)
        return { success: false, error: "Failed to apply coupon" }
    }
}

// 🟢 إلغاء الكوبون
export async function removeCouponAction(cartId: number) {
    try {
        await db.update(cart).set({ couponId: null }).where(eq(cart.id, cartId))
        return await recalcCartTotal(cartId)
    } catch (error) {
        console.error("Error removing coupon:", error)
        return { success: false, error: "Failed to remove coupon" }
    }
}

// 🟢 حذف الكارت بالكامل
export async function clearCart(cartId: number) {
    try {
        await db.delete(cartItems).where(eq(cartItems.cartId, cartId))
        await db.update(cart).set({ totalAmount: "0", couponId: null }).where(eq(cart.id, cartId))
        return { success: true }
    } catch (error) {
        console.error("Error clearing cart:", error)
        return { success: false, error: "Failed to clear cart" }
    }
}

// 🟢 دالة مساعدة لإعادة حساب إجمالي الكارت
async function recalcCartTotal(cartId: number) {
    const items = await db.query.cartItems.findMany({
        where: eq(cartItems.cartId, cartId),
        with: { product: true },
    })

    let total = 0
    for (const item of items) {
        let price = toNumber(item.product.price || 0)
        let discountValue = toNumber(item.product.discountValue || 0)

        if (item.product.discountType === "percentage") {
            price = price - (price * discountValue) / 100
        } else if (item.product.discountType === "fixed") {
            price = price - discountValue
        }

        total += price * item.quantity
    }

    // لو فيه كوبون
    const cartData = await db.query.cart.findFirst({
        where: eq(cart.id, cartId),
        with: { coupon: true },
    })

    console.log('Cart data with coupon:', cartData)

    if (cartData?.coupon) {
        const coupon = cartData.coupon
        console.log('Applying coupon discount:', coupon)
        // Only apply if coupon still active and within validity window
        const now = new Date()
        const active = !!coupon.isActive
        const startsOk = !coupon.validFrom || new Date(coupon.validFrom as unknown as string | Date) <= now
        const endsOk = !coupon.validTo || now <= new Date(coupon.validTo as unknown as string | Date)
        if (active && startsOk && endsOk) {
            if (coupon.discountType === "percentage") {
                const discount = (total * toNumber(coupon.discountValue || 0)) / 100
                total = Math.max(total - discount, 0) // Ensure total doesn't go negative
                console.log('Percentage discount applied:', discount, 'New total:', total)
            } else if (coupon.discountType === "fixed") {
                const discount = toNumber(coupon.discountValue || 0)
                total = Math.max(total - discount, 0) // Ensure total doesn't go negative
                console.log('Fixed discount applied:', discount, 'New total:', total)
            }
        } else {
            console.log('Coupon not applied due to inactive or invalid date window')
        }
    }

    // Drizzle decimal columns expect string inputs
    const totalStr = String(total.toFixed(2))
    await db.update(cart).set({ totalAmount: totalStr }).where(eq(cart.id, cartId))
    return { success: true, data: { cartId, total: Number(totalStr), items } }
}
