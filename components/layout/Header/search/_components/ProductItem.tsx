"use client"

import { ProductProps } from "@/types/product"
import { cn } from "@/lib/utils"
import { Package } from "lucide-react"

type Props = {
  product: ProductProps
  dir: "ltr" | "rtl"
  onClick: (productId: string) => void
}

export function ProductItem({ product, dir, onClick }: Props) {
  return (
    <div
      onClick={() => onClick(product.id?.toString() ?? "")}
      className="flex items-center gap-3 p-3 md:p-4 hover:bg-accent cursor-pointer border-b last:border-b-0 transition-colors"
    >
      <div className="flex-shrink-0">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={dir === "rtl" ? product.nameAr : product.nameEn}
            className="w-10 h-10 md:w-12 md:h-12 rounded object-cover"
          />
        ) : (
          <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded flex items-center justify-center">
            <Package className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className={cn("flex-1 min-w-0", dir === "rtl" && "text-right")}>
        <div className="font-medium text-xs md:text-sm line-clamp-1">
          {dir === "rtl" ? product.nameAr : product.nameEn}
        </div>
        {product.brand && (
          <div className="text-xs text-muted-foreground line-clamp-1">
            {product.brand}
          </div>
        )}
        {product.price && (
          <div className="text-xs md:text-sm font-semibold text-primary">
            ${product.price}
          </div>
        )}
      </div>
    </div>
  )
}
