"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useCartStore } from "@/lib/stores"

export default function OrderSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    // Clear client cart store on success page mount
    clearCart()
    // Also clear persisted storage key to be extra safe
    try {
      if (typeof window !== "undefined") { 
        localStorage.removeItem("cart-storage")
      }
    } catch {}
  }, [clearCart])

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Order Placed Successfully</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase. Your cart has been cleared.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="px-4 py-2 rounded-md bg-gray-900 text-white">Home</Link>
          <Link href="/user-orders" className="px-4 py-2 rounded-md border">View Orders</Link>
        </div>
      </div>
    </main>
  )
}
