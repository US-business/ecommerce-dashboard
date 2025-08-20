"use server"

import { revalidatePath } from "next/cache"
import { OrdersMockService, type Order } from "@/lib/services/orders-mock"

export async function getOrders(): Promise<Order[]> {
  try {
    return await OrdersMockService.getAll()
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

export async function searchOrders(query: string): Promise<Order[]> {
  try {
    return await OrdersMockService.search(query)
  } catch (error) {
    console.error("Error searching orders:", error)
    return []
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    console.log(`Server action: Getting order by ID: ${id}`)
    const order = await OrdersMockService.getById(id)
    console.log(`Server action: Found order:`, order)
    return order
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  try {
    const updatedOrder = await OrdersMockService.updateStatus(id, status)
    if (updatedOrder) {
      revalidatePath("/dashboard/orders")
      revalidatePath(`/dashboard/orders/${id}`)
      return { success: true, data: updatedOrder }
    }
    return { success: false, error: "Order not found" }
  } catch (error) {
    console.error("Error updating order status:", error)
    return { success: false, error: "Failed to update order status" }
  }
}

export async function deleteOrder(id: string) {
  try {
    const success = await OrdersMockService.delete(id)
    if (success) {
      revalidatePath("/dashboard/orders")
      return { success: true }
    }
    return { success: false, error: "Order not found" }
  } catch (error) {
    console.error("Error deleting order:", error)
    return { success: false, error: "Failed to delete order" }
  }
}
