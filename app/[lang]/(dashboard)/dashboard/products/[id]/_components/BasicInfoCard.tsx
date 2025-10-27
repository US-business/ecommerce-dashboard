"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { cn } from "@/lib/utils"
import { ProductProps } from "@/types/product"
import { StatusBadge } from "./StatusBadge"

interface BasicInfoCardProps {
  product: ProductProps | null
  dir: "ltr" | "rtl"
  t: (key: string) => string
}

export function BasicInfoCard({ product, dir, t }: BasicInfoCardProps) {
  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className={cn("text-base sm:text-lg", dir === "rtl" && "text-right")}>
          {t("products.basicInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
        <div className={cn("grid gap-4", dir === "rtl" && "text-right")}> 
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("products.nameEn")}</label>
            <p className="text-lg">{product?.nameEn}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("products.nameAr")}</label>
            <p className="text-lg text-right" dir="rtl">
              {product?.nameAr}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("products.sku")}</label>
            <p>
              <code>{product?.sku}</code>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("common.status")}</label>
            <div className="mt-1">{product && <StatusBadge status={product.status || ""} t={t} />}</div>
          </div>
          {product?.brand && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("products.brand")}</label>
              <p>{product.brand}</p>
            </div>
          )}
          {product?.color && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("products.color")}</label>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: product.color }} />
                </div>
                <p>{product.color}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
