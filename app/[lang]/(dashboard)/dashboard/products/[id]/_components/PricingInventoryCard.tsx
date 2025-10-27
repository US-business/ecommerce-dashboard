"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { cn } from "@/lib/utils"
import { ProductProps } from "@/types/product"

interface PricingInventoryCardProps {
  product: ProductProps | null
  dir: "ltr" | "rtl"
  t: (key: string) => string
}

export function PricingInventoryCard({ product, dir, t }: PricingInventoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn(dir === "rtl" && "text-right")}>
          {t("products.pricingInventory")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={cn("grid gap-4", dir === "rtl" && "text-right")}>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("products.price")}</label>
            <p className="text-2xl font-bold">${product?.price}</p>
          </div>
          {product?.discountType && product?.discountValue && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("products.discount")}</label>
              <p>
                {product.discountValue}
                {product.discountType === "percentage" ? "%" : "LE"} {t("common.off")}
              </p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("products.quantity")}</label>
            <p className="text-lg">{product?.quantityInStock}</p>
          </div>
          {product?.isFeatured && (
            <div>
              <Badge variant="secondary">{t("products.featuredProduct")}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
