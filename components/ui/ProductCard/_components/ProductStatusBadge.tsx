"use client"

import { Badge } from "@/components/shadcnUI/badge"
import { cn } from "@/lib/utils"
import { ProductStatus } from "@/types/product"
import { getStatusColor, getStatusText } from "./utils"
import { ProductProps } from "@/types/product"
import WishlistButton from "@/components/ui/WishlistButton"

interface ProductStatusBadgeProps {
  status: ProductStatus
  isVisible: boolean
  dir: string
  translations?: {
    bestSeller?: string
    new?: string
    comingSoon?: string
    onSale?: string
  }
  className?: string
  product: ProductProps
  hiddenButtonCart?: boolean
  lang?: string
}

export const ProductStatusBadge = ({
  status,
  isVisible,
  dir,
  translations,
  className,
  product,
  hiddenButtonCart,
  lang = 'en'
}: ProductStatusBadgeProps) => {
  if (!isVisible || status === 'normal') return null

  return (
    <div className={cn("absolute top-2 z-10 flex flex-col gap-2", `${dir === 'rtl' ? 'right-2' : 'left-2'}`)}>
      <Badge
        className={cn(getStatusColor(status), className)}
      >
        {getStatusText(status, dir, translations)}
      </Badge>
      {product.quantityInStock && hiddenButtonCart ? (
        <WishlistButton
          productId={Number(product.id)}
          dir={dir}
          lang={lang}
        />
      ) : null}
    </div>
  )
}
