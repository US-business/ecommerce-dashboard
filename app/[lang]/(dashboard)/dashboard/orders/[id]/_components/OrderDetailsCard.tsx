'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { UpdateOrderStatus } from "../../_components/UpdateOrderStatus"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { cn } from "@/lib/utils"
import { getStatusColor } from "./utils"

interface OrderDetailsCardProps {
  order: {
    id: number
    status: string
    paymentStatus: string
    paymentType: string
    shippingMethod: string
    createdAt: Date | null
  }
}

export function OrderDetailsCard({ order }: OrderDetailsCardProps) {
  const { t, locale, dir } = useI18nStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("orders.orderDetails")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={cn(
          "flex items-center gap-3 ",
        )}>
          <span>{t("orders.orderId")}:</span>
          <span className="font-medium">#{order.id}</span>
        </div>
        <div className={cn(
          "flex items-center gap-3",
        )}>
          <span>{t("orders.status")}:</span>
          <UpdateOrderStatus orderId={order.id} currentStatus={order.status as any} />
        </div>
        <div className={cn(
          "flex items-center gap-3",
        )}>
          <span>{t("orders.paymentStatus")}:</span>
          <Badge className={getStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
        </div>
        <div className={cn(
          "flex items-center gap-3",
        )}>
          <span>{t("orders.paymentMethod")}:</span>
          <span>{order.paymentType}</span>
        </div>
        <div className={cn(
          "flex items-center gap-3",
        )}>
          <span>{t("orders.shippingMethod")}:</span>
          <span>{order.shippingMethod}</span>
        </div>
        <div className={cn(
          "flex items-center gap-3",
        )}>
          <span>{t("orders.createdAt")}:</span>
          <span>{order.createdAt ? new Date(order.createdAt).toLocaleString(locale) : "N/A"}</span>
        </div>
      </CardContent>
    </Card>
  )
}
