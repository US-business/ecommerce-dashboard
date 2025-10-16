import { Badge } from "@/components/shadcnUI/badge"
import { cn } from "@/lib/utils"

interface ProductDiscountBadgeProps {
  hasDiscount: boolean
  discountType: string
  discountValue: number
  currencySymbol: string
  dir: string
  className?: string
}

export const ProductDiscountBadge = ({
  hasDiscount,
  discountType,
  discountValue,
  currencySymbol,
  dir,
  className
}: ProductDiscountBadgeProps) => {
  if (!hasDiscount) return null

  return (
    <div className={cn("absolute top-3 flex flex-col gap-2 z-10", dir === 'rtl' ? 'left-2' : 'right-2')}>
      <Badge className={cn("bg-amber-600 text-white hover:bg-amber-700 font-bold text-sm py-1 shadow-md")}>
        -{discountType === "percentage" ? `${discountValue}%` : `${currencySymbol} ${discountValue}`}
      </Badge>
    </div>
  )
}
