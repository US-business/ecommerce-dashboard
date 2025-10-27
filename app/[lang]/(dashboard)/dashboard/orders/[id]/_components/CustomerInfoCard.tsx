'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { User, Phone, MapPin } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { cn } from "@/lib/utils"

interface CustomerInfoCardProps {
  order: {
    user?: {
      username: string | null
      email: string | null
      phoneNumber: string | null
    } | null
    shippingAddress: string
  }
}

export function CustomerInfoCard({ order }: CustomerInfoCardProps) {
  const { t, dir } = useI18nStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn(
          "flex items-center gap-2",
        )}>
          <User className="h-5 w-5" />
          {t("orders.customerInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("orders.name")}</label>
            <p className="font-medium">{order.user?.username || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("orders.email")}</label>
            <p className="font-medium">{order.user?.email || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("orders.phone")}</label>
            <p className={cn(
              "font-medium flex items-center gap-2",
            )}>
              <Phone className="h-4 w-4" />
              {order.user?.phoneNumber || 'N/A'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("orders.shippingAddress")}</label>
            <p className={cn(
              "font-medium flex items-start gap-2",
            )}>
              <MapPin className="h-4 w-4 mt-0.5" />
              {order.shippingAddress}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
