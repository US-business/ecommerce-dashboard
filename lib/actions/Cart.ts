'use server'

import { db } from '@/lib/db' // تأكد من مسار قاعدة البيانات الصحيح
import { cart, cartItems } from '@/lib/db/schema' // تأكد من مسار السكيما الصحيح
import { eq, and, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// نوع البيانات للكارت
export type Cart = {
   id: number
   userId: number
   totalAmount: string | null
   quantity: number
   couponId: number | null
   createdAt: Date | null
   updatedAt: Date | null
}

export type CreateCartData = {
   userId: number
   totalAmount?: number
   quantity?: number
   couponId?: number
}

export type UpdateCartData = {
   totalAmount?: number
   quantity?: number
   couponId?: number
}

// 1. إنشاء كارت جديد
export async function createCart(data: CreateCartData) {
   try {
      const result = await db
         .insert(cart)
         .values({
            userId: data.userId,
            totalAmount: data.totalAmount?.toString() || '0.00',
            quantity: data.quantity || 1,
            couponId: data.couponId || null,
         })
         .returning()

      revalidatePath('/cart')
      return {
         success: true,
         data: result[0],
         message: 'تم إنشاء الكارت بنجاح'
      }
   } catch (error) {
      console.error('خطأ في إنشاء الكارت:', error)
      return {
         success: false,
         error: 'فشل في إنشاء الكارت'
      }
   }
}

// 2. جلب كارت بواسطة المعرف
export async function getCartById(cartId: number) {
   try {
      const result = await db
         .select()
         .from(cart)
         .where(eq(cart.id, cartId))
         .limit(1)

      if (result.length === 0) {
         return {
            success: false,
            error: 'الكارت غير موجود'
         }
      }

      return {
         success: true,
         data: result[0]
      }
   } catch (error) {
      console.error('خطأ في جلب الكارت:', error)
      return {
         success: false,
         error: 'فشل في جلب الكارت'
      }
   }
}

// 3. جلب كارت بواسطة معرف المستخدم
export async function getCartByUserId(userId: number) {
   try {
      const result = await db
         .select()
         .from(cart)
         .where(eq(cart.userId, userId))
         .orderBy(desc(cart.createdAt))
         .limit(1)

      return {
         success: true,
         data: result[0] || null
      }
   } catch (error) {
      console.error('خطأ في جلب كارت المستخدم:', error)
      return {
         success: false,
         error: 'فشل في جلب كارت المستخدم'
      }
   }
}

// 4. جلب جميع الكارتات
export async function getAllCarts() {
   try {
      const result = await db
         .select()
         .from(cart)
         .orderBy(desc(cart.createdAt))

      return {
         success: true,
         data: result
      }
   } catch (error) {
      console.error('خطأ في جلب جميع الكارتات:', error)
      return {
         success: false,
         error: 'فشل في جلب جميع الكارتات'
      }
   }
}

// 5. تحديث الكارت
export async function updateCart(cartId: number, data: UpdateCartData) {
   try {
      const updateData: any = {
         updatedAt: new Date()
      }

      if (data.totalAmount !== undefined) {
         updateData.totalAmount = data.totalAmount.toString()
      }
      if (data.quantity !== undefined) {
         updateData.quantity = data.quantity
      }
      if (data.couponId !== undefined) {
         updateData.couponId = data.couponId
      }

      const result = await db
         .update(cart)
         .set(updateData)
         .where(eq(cart.id, cartId))
         .returning()

      if (result.length === 0) {
         return {
            success: false,
            error: 'الكارت غير موجود'
         }
      }

      revalidatePath('/cart')
      return {
         success: true,
         data: result[0],
         message: 'تم تحديث الكارت بنجاح'
      }
   } catch (error) {
      console.error('خطأ في تحديث الكارت:', error)
      return {
         success: false,
         error: 'فشل في تحديث الكارت'
      }
   }
}

// 6. حذف الكارت
export async function deleteCart(cartId: number) {
   try {
      // أولاً احذف جميع العناصر المرتبطة بالكارت
      await db
         .delete(cartItems)
         .where(eq(cartItems.cartId, cartId))

      // ثم احذف الكارت نفسه
      const result = await db
         .delete(cart)
         .where(eq(cart.id, cartId))
         .returning()

      if (result.length === 0) {
         return {
            success: false,
            error: 'الكارت غير موجود'
         }
      }

      revalidatePath('/cart')
      return {
         success: true,
         message: 'تم حذف الكارت بنجاح'
      }
   } catch (error) {
      console.error('خطأ في حذف الكارت:', error)
      return {
         success: false,
         error: 'فشل في حذف الكارت'
      }
   }
}

// 7. حذف كارت بواسطة معرف المستخدم
export async function deleteCartByUserId(userId: number) {
   try {
      // جلب الكارت أولاً
      const userCart = await db
         .select({ id: cart.id })
         .from(cart)
         .where(eq(cart.userId, userId))

      if (userCart.length === 0) {
         return {
            success: false,
            error: 'لا يوجد كارت لهذا المستخدم'
         }
      }

      // حذف جميع العناصر المرتبطة
      for (const cartItem of userCart) {
         await db
            .delete(cartItems)
            .where(eq(cartItems.cartId, cartItem.id))
      }

      // حذف الكارت
      const result = await db
         .delete(cart)
         .where(eq(cart.userId, userId))
         .returning()

      revalidatePath('/cart')
      return {
         success: true,
         message: 'تم حذف كارت المستخدم بنجاح'
      }
   } catch (error) {
      console.error('خطأ في حذف كارت المستخدم:', error)
      return {
         success: false,
         error: 'فشل في حذف كارت المستخدم'
      }
   }
}

// 8. تفريغ الكارت (حذف جميع العناصر فقط)
export async function clearCart(cartId: number) {
   try {
      // حذف جميع العناصر
      await db
         .delete(cartItems)
         .where(eq(cartItems.cartId, cartId))

      // تحديث الكارت
      const result = await db
         .update(cart)
         .set({
            totalAmount: '0.00',
            quantity: 0,
            updatedAt: new Date()
         })
         .where(eq(cart.id, cartId))
         .returning()

      if (result.length === 0) {
         return {
            success: false,
            error: 'الكارت غير موجود'
         }
      }

      revalidatePath('/cart')
      return {
         success: true,
         data: result[0],
         message: 'تم تفريغ الكارت بنجاح'
      }
   } catch (error) {
      console.error('خطأ في تفريغ الكارت:', error)
      return {
         success: false,
         error: 'فشل في تفريغ الكارت'
      }
   }
}

// 9. جلب الكارت مع العناصر والمنتجات (استعلام معقد)
export async function getCartWithItems(userId: number) {
   try {
      const result = await db
         .select({
            cart: cart,
            cartItem: cartItems,
            // يمكنك إضافة بيانات المنتجات هنا إذا كنت تريد
         })
         .from(cart)
         .leftJoin(cartItems, eq(cart.id, cartItems.cartId))
         .where(eq(cart.userId, userId))
         .orderBy(desc(cart.createdAt))

      return {
         success: true,
         data: result
      }
   } catch (error) {
      console.error('خطأ في جلب الكارت مع العناصر:', error)
      return {
         success: false,
         error: 'فشل في جلب الكارت مع العناصر'
      }
   }
}

// 10. تطبيق كوبون على الكارت
export async function applyCouponToCart(cartId: number, couponId: number) {
   try {
      const result = await db
         .update(cart)
         .set({
            couponId: couponId,
            updatedAt: new Date()
         })
         .where(eq(cart.id, cartId))
         .returning()

      if (result.length === 0) {
         return {
            success: false,
            error: 'الكارت غير موجود'
         }
      }

      revalidatePath('/cart')
      return {
         success: true,
         data: result[0],
         message: 'تم تطبيق الكوبون بنجاح'
      }
   } catch (error) {
      console.error('خطأ في تطبيق الكوبون:', error)
      return {
         success: false,
         error: 'فشل في تطبيق الكوبون'
      }
   }
}

// 11. إزالة الكوبون من الكارت
export async function removeCouponFromCart(cartId: number) {
   try {
      const result = await db
         .update(cart)
         .set({
            couponId: null,
            updatedAt: new Date()
         })
         .where(eq(cart.id, cartId))
         .returning()

      if (result.length === 0) {
         return {
            success: false,
            error: 'الكارت غير موجود'
         }
      }

      revalidatePath('/cart')
      return {
         success: true,
         data: result[0],
         message: 'تم إزالة الكوبون بنجاح'
      }
   } catch (error) {
      console.error('خطأ في إزالة الكوبون:', error)
      return {
         success: false,
         error: 'فشل في إزالة الكوبون'
      }
   }
}