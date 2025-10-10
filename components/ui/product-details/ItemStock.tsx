import { cn } from '@/lib/utils'
import React from 'react'

type ItemStockProps = {
   quantityInStock: number
   dir: string
}

const ItemStock = ({ quantityInStock, dir }: ItemStockProps) => {
   return (
      <>
         {quantityInStock > 0 &&
            <div className={cn("flex items-center space-x-2 gap-2")}>
               {dir === "rtl" ? <>

                  <div className={cn("w-3 h-3 rounded-full", quantityInStock > 0 ? "bg-green-500" : "bg-red-500")}></div>
                  <span className={cn("font-medium font-mono", quantityInStock > 0 ? "text-green-600" : "text-red-600")}>
                     {quantityInStock > 0
                        ? ` متوفر (${quantityInStock} قطعة) `
                        : " غير متوفر "
                     }
                  </span>
               </> : <>
                  <div className={cn("w-3 h-3 rounded-full", quantityInStock > 0 ? "bg-green-500" : "bg-red-500")}></div>
                  <span className={cn("font-medium", quantityInStock > 0 ? "text-green-600" : "text-red-600")}>
                     {quantityInStock > 0
                        ? `In Stock (${quantityInStock} items)`
                        : "Out of Stock"
                     }
                  </span>
               </>
            
               }
            </div>
         }
      </>
   )
}

export default ItemStock