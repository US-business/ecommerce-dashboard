import { cn } from '@/lib/utils'
import React from 'react'

type ItemStockProps = {
   quantityInStock: number
   dir: string
}

const ItemStock = ({ quantityInStock, dir }: ItemStockProps) => {
   const isInStock = quantityInStock > 0;
   const lowStock = quantityInStock > 0 && quantityInStock <= 5;

   return (
      <div className={cn("flex items-center gap-2 flex-wrap")}>
         <div className={cn(
            "w-3 h-3 rounded-full animate-pulse flex-shrink-0",
            isInStock ? (lowStock ? "bg-orange-500" : "bg-green-500") : "bg-red-500"
         )} />
         <span className={cn(
            "font-medium text-sm sm:text-base",
            isInStock ? (lowStock ? "text-orange-600" : "text-green-600") : "text-red-600"
         )}>
            {dir === "rtl" ? (
               isInStock
                  ? `متوفر (${quantityInStock} قطعة)${lowStock ? " - كمية محدودة!" : ""}`
                  : "غير متوفر"
            ) : (
               isInStock
                  ? `In Stock (${quantityInStock} items)${lowStock ? " - Limited!" : ""}`
                  : "Out of Stock"
            )}
         </span>
      </div>
   )
}

export default ItemStock