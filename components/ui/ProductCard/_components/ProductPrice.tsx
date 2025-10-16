import { cn } from "@/lib/utils"

interface ProductPriceProps {
  price: number
  discountedPrice: number
  currencySymbol: string
  hasDiscount: boolean
  dir: string
  className?: string
}

export const ProductPrice = ({
  price,
  discountedPrice,
  currencySymbol,
  hasDiscount,
  dir,
  className
}: ProductPriceProps) => {
  return (
    <div className={cn("flex flex-col gap-1 mt-auto", className)}>
      {hasDiscount ? (
        <>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-bold text-amber-600">
              {currencySymbol} {discountedPrice.toFixed(2)}
            </span>
            <span className="text-base text-gray-400 line-through">
              {currencySymbol} {price.toFixed(2)}
            </span>
          </div>
          <span className="text-xs text-green-600 font-medium">
            {dir === 'rtl'
              ? `وفر ${(price - discountedPrice).toFixed(2)} ${currencySymbol}`
              : `Save ${currencySymbol} ${(price - discountedPrice).toFixed(2)}`}
          </span>
        </>
      ) : (
        <span className="text-2xl font-bold text-gray-900">
          {currencySymbol} {price.toFixed(2)}
        </span>
      )}
    </div>
  )
}
