'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { CreditCard } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { cn } from "@/lib/utils"
import { getStatusColor } from "./utils"

interface PaymentInfoCardProps {
  order: {
    paymentType: string
    paymentStatus: string
  }
}

export function PaymentInfoCard({ order }: PaymentInfoCardProps) {
  const { t, dir } = useI18nStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn(
          "flex items-center gap-2",
        )}>
          <CreditCard className="h-5 w-5" />
          {t("orders.paymentInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("orders.paymentMethod")}</label>
            <p className="font-medium">{order.paymentType}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("orders.paymentStatus")}</label>
            <Badge className={getStatusColor(order.paymentStatus)}>
              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
