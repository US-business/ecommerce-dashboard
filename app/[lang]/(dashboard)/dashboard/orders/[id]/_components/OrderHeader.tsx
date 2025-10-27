'use client'

import Link from "next/link"
import { Button } from "@/components/shadcnUI/button"
import { ArrowLeft, Printer } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { cn } from "@/lib/utils"

interface OrderHeaderProps {
  orderId: number
  createdAt: Date | null
}

export function OrderHeader({ orderId, createdAt }: OrderHeaderProps) {
  const { t, locale, dir } = useI18nStore()

  return (
    <div className={cn(
      "flex justify-between items-center",
    )}>
      <div className={cn(
        "flex items-center gap-4",
      )}>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/orders">
            <ArrowLeft className={cn("h-4 w-4", dir === "rtl" ? "ml-2 rotate-180" : "mr-2")} />
            {t("orders.backToOrders")}
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t("orders.orderNumber")}{orderId}</h1>
          <p className="text-muted-foreground">
            {t("orders.createdOn")} {createdAt ? new Date(createdAt).toLocaleDateString(locale) : "N/A"}
          </p>
        </div>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href={`/dashboard/orders/${orderId}/invoice`} target="_blank">
          <Printer className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
          {t("orders.printInvoice")}
        </Link>
      </Button>
    </div>
  )
}
