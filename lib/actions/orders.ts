"use server";

import { db } from "@/lib/db";
import { orders, orderItems, products, cart, cartItems, users, orderNotes } from "@/lib/db/schema";
import { eq, or, ilike, inArray, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type CartItem } from "@/types/cart";

export async function getOrderById(id: string) {
  try {
    const orderId = parseInt(id, 10);
    if (isNaN(orderId)) {
      return null;
    }

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        user: true,
        coupon: true,
        items: {
          with: {
            product: true,
          },
        },
        notes: {
          with: {
            user: true
          }
        }
      },
    });

    return order;
  } catch (error) {
    console.error(`Failed to fetch order with id ${id}:`, error);
    return null;
  }
}

export async function getOrders() {
  try {
    const allOrders = await db.query.orders.findMany({
      with: {
        user: true,
        coupon: true,
      },
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });
    return allOrders;
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    return [];
  }
}

export async function searchOrders(query: string) {
  try {
    const userIds = await db.select({ id: users.id }).from(users).where(or(
        ilike(users.username, `%${query}%`),
        ilike(users.email, `%${query}%`)
    ));
    const matchingUserIds = userIds.map(u => u.id);

    const whereClauses = [
        ilike(orders.status, `%${query}%`)
    ];

    if (matchingUserIds.length > 0) {
        whereClauses.push(inArray(orders.userId, matchingUserIds));
    }

    if (!isNaN(parseInt(query))) {
        whereClauses.push(eq(orders.id, parseInt(query)));
    }

    const searchResults = await db.query.orders.findMany({
      with: {
        user: true,
        coupon: true,
      },
      where: or(...whereClauses),
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });
    return searchResults;
  } catch (error) {
    console.error("Failed to search orders:", error);
    return [];
  }
}

export async function getUserOrders(userId: number) {
  try {
    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });

    return userOrders;
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return [];
  }
}

export async function updateOrderStatus(id: number, status: "pending" | "processing" | "shipped" | "delivered" | "cancelled") {
  try {
    const [updatedOrder] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    if (updatedOrder) {
      revalidatePath("/dashboard/orders");
      revalidatePath(`/dashboard/orders/${id}`);
      return { success: true, data: updatedOrder };
    }
    return { success: false, error: "Order not found" };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function deleteOrder(id: number) {
  try {
    const [deletedOrder] = await db.delete(orders).where(eq(orders.id, id)).returning();
    if (deletedOrder) {
      revalidatePath("/dashboard/orders");
      return { success: true };
    }
    return { success: false, error: "Order not found" };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}

export async function createOrderFromCart(
  userId: number,
  shippingAddress: string,
  shippingMethod: string,
  shippingCost: number,
  paymentType: string,
  paymentStatus: string,
  cartItemsData: CartItem[],
  subtotal: number,
  discountAmount: number,
  totalAmount: number,
  couponId: number | null
) {
  try {
    // 1. Create the order
    const [newOrder] = await db
      .insert(orders)
      .values({
        userId,
        shippingAddress,
        shippingMethod,
        shippingCost: String(shippingCost),
        discountAmount: String(discountAmount),
        couponId,
        subtotal: String(subtotal),
        totalAmount: String(totalAmount),
        status: "pending",
        paymentType,
        paymentStatus,
      })
      .returning();

    // 2. Create order items
    const orderItemsValues = cartItemsData.map((item) => ({
      orderId: newOrder.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price!,
    }));

    await db.insert(orderItems).values(orderItemsValues);

    // 3. Update product stock
    for (const item of cartItemsData) {
      const product = await db.query.products.findFirst({
        where: eq(products.id, item.productId),
      });

      if (product) {
        const currentStock = product.quantityInStock ?? 0;
        const newStock = Math.max(0, currentStock - item.quantity);
        await db
          .update(products)
          .set({ quantityInStock: newStock })
          .where(eq(products.id, item.productId));
      }
    }

    // 4. Clear user's cart
    const userCart = await db.query.cart.findFirst({
      where: eq(cart.userId, userId),
    });

    if (userCart) {
      await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id));
      await db.delete(cart).where(eq(cart.id, userCart.id));
    }

    // 5. Revalidate paths
    revalidatePath("/dashboard/orders");
    revalidatePath(`/orders/${newOrder.id}`);
    revalidatePath("/cart");
    // Revalidate product pages
    const productIds = cartItemsData.map((item) => item.productId);
    productIds.forEach(id => revalidatePath(`/products/${id}`));


    return { success: true, data: newOrder };
  } catch (error) {
    console.error("Error creating order from cart:", error);
    return { success: false, error: "Failed to create order from cart" };
  }
}

export async function placeOrderFromCheckout(
  context: {
    userId: number | undefined;
    cartItemsData: CartItem[];
    subtotal: number;
    discountAmount: number;
    couponId: number | null;
  },
  formData: FormData
) {
  const { userId, cartItemsData, subtotal, discountAmount, couponId } = context;

  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  const shippingAddressFields = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    address: formData.get("address") as string,
    apartment: formData.get("apartment") as string,
    city: formData.get("city") as string,
    governorate: formData.get("governorate") as string,
    postalCode: formData.get("postalCode") as string,
  };

  const shippingAddress = Object.values(shippingAddressFields).filter(Boolean).join(', ');

  const shippingMethod = formData.get("selectedShippingMethod") as string;
  const paymentType = formData.get("paymentMethod") as string;
  const paymentStatus = "pending";
  const shippingCost = shippingMethod === 'express' ? 200 : 0;
  const totalAmount = subtotal - discountAmount + shippingCost;


  try {
    const res = await createOrderFromCart(
      userId,
      shippingAddress,
      shippingMethod,
      shippingCost,
      paymentType,
      paymentStatus,
      cartItemsData,
      subtotal,
      discountAmount,
      totalAmount,
      couponId
    );
    
    if (res.success) revalidatePath("/order-success")

    return { success: true, data: res.data }
  } catch (error) {
    console.error("Error placing order from checkout:", error);
    return { success: false, error: "Failed to place order from checkout" };
  }
}

export async function getOrderNotes(orderId: number) {
  try {
    const notes = await db.query.orderNotes.findMany({
      where: eq(orderNotes.orderId, orderId),
      with: {
        user: true,
      },
      orderBy: [desc(orderNotes.createdAt)],
    });
    return notes;
  } catch (error) {
    console.error(`Failed to fetch notes for order ${orderId}:`, error);
    return [];
  }
}

export async function addOrderNote(orderId: number, note: string, userId: number) {
  try {
    const [newNote] = await db.insert(orderNotes).values({
      orderId,
      note,
      userId,
    }).returning();

    revalidatePath(`/dashboard/orders/${orderId}`);

    return { success: true, data: newNote };
  } catch (error) {
    console.error("Error adding order note:", error);
    return { success: false, error: "Failed to add note." };
  }
}