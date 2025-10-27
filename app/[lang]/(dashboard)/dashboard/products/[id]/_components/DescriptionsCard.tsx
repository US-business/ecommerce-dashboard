"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { cn } from "@/lib/utils"
import { ProductProps } from "@/types/product"

interface DescriptionsCardProps {
  product: ProductProps | null
  dir: "ltr" | "rtl"
  t: (key: string) => string
}

export function DescriptionsCard({ product, dir, t }: DescriptionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn(dir === "rtl" && "text-right")}>
          {t("products.description")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {product?.descriptionEn && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("products.descriptionEn")}</label>
            <p className="mt-1 text-sm leading-relaxed">{product.descriptionEn}</p>
          </div>
        )}
        {product?.descriptionAr && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("products.descriptionAr")}</label>
            <p className="mt-1 text-sm leading-relaxed text-right" dir="rtl">
              {product.descriptionAr}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
