'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Package } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { cn } from "@/lib/utils"

interface OrderItem {
  id: number
  quantity: number
  price: string | number
  product?: {
    nameEn: string | null
    nameAr: string | null
  } | null
}

interface OrderItemsCardProps {
  order: {
    items: OrderItem[]
    totalAmount: string | number
  }
}

export function OrderItemsCard({ order }: OrderItemsCardProps) {
  const { t, dir } = useI18nStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn(
          "flex items-center gap-2",
        )}>
          <Package className="h-5 w-5" />
          {t("orders.orderItems")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className={cn(
              "flex items-center justify-between p-4 border rounded-lg",
            )}>
              <div className="flex-1">
                <h4 className="font-medium">{item.product?.nameEn || 'N/A'}</h4>
                <p className="text-sm text-muted-foreground">{item.product?.nameAr || ''}</p>
                <p className="text-sm text-muted-foreground">
                  {t("orders.quantity")}: {item.quantity} × EGP {Number(item.price).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">EGP {(item.quantity * Number(item.price)).toFixed(2)}</p>
              </div>
            </div>
          ))}

          {/* Order Total */}
          <div className="border-t pt-4">
            <div className={cn(
              "flex items-center justify-between text-lg font-bold",
              {
                
              })}>
              <span>{t("orders.total")}:</span>
              <span>EGP {Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
