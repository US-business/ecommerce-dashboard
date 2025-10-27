'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { cn } from "@/lib/utils"

interface PricingDetailsCardProps {
  order: {
    subtotal: string | number
    shippingCost: string | number | null
    discountAmount?: string | number | null
    totalAmount: string | number
    coupon?: {
      code: string
      discountType: string
      discountValue: string | number | null
    } | null
  }
}

export function PricingDetailsCard({ order }: PricingDetailsCardProps) {
  const { t, dir } = useI18nStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("orders.pricingDetails")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={cn(
          "flex items-center gap-3",
        )}>
          <span>{t("orders.shipping")}:</span>
          <span>{ dir === "rtl" ? "ج.م" : "EGP"} {Number(order.shippingCost || 0).toFixed(2)}</span>
        </div>
        {order.coupon && (
          <div className={cn(
            "flex items-center gap-3 text-green-600",
          )}>
            <span>{t("orders.coupon")} ({order.coupon.code}):</span>
            {order.coupon.discountType === 'percentage'
              ? <span> -{order.coupon.discountValue}%</span>
              : <span> -{ dir === "rtl" ? "ج.م" : "EGP"} {Number(order.coupon.discountValue).toFixed(2)}</span>
            }
          </div>
        )}
        {order?.discountAmount && Number(order?.discountAmount) > 0 && !order.coupon && (
          <div className={cn(
            "flex items-center gap-3 text-green-600",
          )}>
            <span>{t("orders.discount")}:</span>
            <span> -{ dir === "rtl" ? "ج.م" : "EGP"} {Number(order?.discountAmount).toFixed(2)}</span>
          </div>
        )}
        <div className={cn(
          "flex items-center gap-3 text-lg font-bold",
        )}>
          <span>{t("orders.total")}:</span>
          <span>{ dir === "rtl" ? "ج.م" : "EGP"} {Number(order?.totalAmount).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
