"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Package } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewProductInfoProps {
  productName: string
  productId: number
  dir: "ltr" | "rtl"
  translations: {
    title: string
    productName: string
    productId: string
  }
}

export function ReviewProductInfo({ 
  productName, 
  productId, 
  dir, 
  translations 
}: ReviewProductInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse text-right")}>
          <Package className="h-5 w-5" />
          {translations.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={cn("grid grid-cols-1 gap-4", dir === "rtl" && "text-right")}>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {translations.productName}
            </label>
            <p className="font-medium">{productName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {translations.productId}
            </label>
            <p className="font-medium">{productId}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
