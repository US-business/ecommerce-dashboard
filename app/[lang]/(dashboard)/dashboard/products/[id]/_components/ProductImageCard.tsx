"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ProductProps } from "@/types/product"

interface ProductImageCardProps {
  product: ProductProps | null
  dir: "ltr" | "rtl"
  t: (key: string) => string
}

export function ProductImageCard({ product, dir, t }: ProductImageCardProps) {
  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className={cn("text-base sm:text-lg", dir === "rtl" && "text-right")}>
          {t("products.productImage")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {product?.images && product.images.length > 0 ? (
          <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden">
            <Image
              src={product.images[0]}
              alt={dir === "rtl" ? (product?.nameAr || "") : (product?.nameEn || "")}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        ) : (
          <div className="w-full h-48 sm:h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-sm sm:text-base text-muted-foreground">{t("products.noImage")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
