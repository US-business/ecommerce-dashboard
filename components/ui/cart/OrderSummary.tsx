"use client"
import { Button } from '@/components/shadcnUI/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcnUI/card'
import { Separator } from '@/components/shadcnUI/separator'
import { useCartStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import { type CartItem } from "@/lib/stores/cart-store"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { Coupon, useCouponsStore } from '@/lib/stores/coupons-store'
import AppliedCoupon from './AppliedCoupon'


type OrderSummaryProps = {
   cart: any
   couponsDB?: Coupon[]
   dir: string
   currentCoupon?: Coupon | null
   cartId: number
   dictionary?: any
}

const OrderSummary = ({ cart, couponsDB, dir, currentCoupon, cartId, dictionary }: OrderSummaryProps) => {

   const { items, removeItem, setItems, getTotalPrice } = useCartStore()
   const { coupons } = useCouponsStore()
   const router = useRouter()

   // Use the current coupon from the database, fallback to store
   const appliedCoupon = currentCoupon || coupons[0]

   const subtotal = getTotalPrice()

   const couponDiscount = appliedCoupon
      ? appliedCoupon.discountType === 'percentage'
         ? (subtotal * Number(appliedCoupon?.discountValue)) / 100
         : Math.min(Number(appliedCoupon.discountValue), subtotal)
      : 0

   const taxableAmount = Math.max(subtotal - couponDiscount, 0)


   const total = taxableAmount

   if (cart.length === 0) {
      return null
   }

   useEffect(() => {
      if (cart?.success && Array.isArray(cart?.data?.items)) {
         const mapped: CartItem[] = (cart.data?.items ?? []).map((item: CartItem) => ({
            id: Number(item.id),
            productId: Number(item.productId),
            quantity: Number(item.quantity),
            product: {
               id: Number(item.product?.id),
               nameEn: String(item.product?.nameEn ?? ""),
               nameAr: String(item.product?.nameAr ?? ""),
               price: item.product?.price != null ? String(item.product.price) : null,
               images: Array.isArray(item.product?.images) ? item.product.images : [],
               quantityInStock: Number(item.product?.quantityInStock ?? 0),
               discountType: (item.product?.discountType as 'fixed' | 'percentage' | 'none') ?? 'none',
               discountValue: item.product?.discountValue != null ? String(item.product.discountValue) : null,
            },
            coupon: item.coupon,
         }))
         setItems(mapped)
      } else {
         // No server cart; ensure local store is cleared to avoid stale items
         setItems([])
      }
   }, [cart?.success, cart?.data?.items, setItems])


   return (
      <>
         {/* Order Summary */}
         <div className="space-y-6">
            {/* Applied Coupon */}
            <AppliedCoupon coupons={couponsDB ?? []} dir={dir} cartId={cartId} currentCoupon={currentCoupon} />

            {/* Order Summary */}
            <Card>
               <CardHeader>
                  <CardTitle>{dictionary?.cart?.orderSummary || "Order Summary"}</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className={cn("flex justify-between", dir === "rtl" && "flex-row-reverse")}>
                     <span>{dictionary?.cart?.subtotal || "Subtotal"}</span>
                     <span>EGP{subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                     <div className={cn("flex justify-between text-green-600", dir === "rtl" && "flex-row-reverse")}>
                        <span>
                           {dictionary?.cart?.discount || "Discount"} ({appliedCoupon.code})
                        </span>
                        <span>-EGP{couponDiscount.toFixed(2)}</span>
                     </div>
                  )}
                  <Separator />
                  <div className={cn("flex justify-between text-lg font-bold", dir === "rtl" && "flex-row-reverse")}>
                     <span>{dictionary?.cart?.total || "Total"}</span>
                     <span>EGP{total.toFixed(2)}</span>
                  </div>
                  <Button
                     onClick={() => router.push("/checkout")}
                     className="w-full"
                     size="lg"
                     disabled={items.some((item) => item.product.quantityInStock <= 0)}
                  >
                     {dictionary?.cart?.checkout || "Proceed to Checkout"}
                     <ArrowRight className={cn("w-4 h-4", dir === "rtl" ? "mr-2 rotate-180" : "ml-2")} />
                  </Button>
                  {items.some((item) => item.product.quantityInStock <= 0) && (
                     <p className="text-sm text-red-600 text-center">
                        {dictionary?.cart?.removeOutOfStockItems || "Please remove out-of-stock items to continue"}
                     </p>
                  )}
               </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
               <CardContent className="p-4">
                  <p className="text-sm text-gray-600 mb-3 text-center">
                     {dictionary?.cart?.acceptedPaymentMethods || "Accepted Payment Methods"}
                  </p>
                  <div className="flex justify-center space-x-4">
                     <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                     </div>
                     <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        MC
                     </div>
                     <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                        AMEX
                     </div>
                     <div className="w-12 h-8 bg-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">
                        PP
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </>
   )
}

export default OrderSummary