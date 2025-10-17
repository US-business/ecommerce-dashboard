import { cn } from '@/lib/utils'
import React from 'react'

type ItemDescriptionProps = {
   dir: string
   descriptionAr?: string
   descriptionEn?: string
}


const ItemDescription = ({ dir, descriptionAr, descriptionEn }: ItemDescriptionProps) => {
   return (
      <>

         {(descriptionEn || descriptionAr) && dir === "rtl" ? (
            <div className={cn("space-y-2" , dir === "rtl" && "text-left")}>
               <h4 className={cn("font-semibold font-mono text-lg")}>وصف المنتج</h4>
               <p className={cn("text-gray-600 leading-relaxed")}>
                  {descriptionAr}
               </p>
            </div>
         ) : (
            <div className={cn("space-y-2")}>
               <h4 className='font-semibold  text-lg'>Product Description</h4>
               <p className={cn("text-gray-600 leading-relaxed")}>
                  {descriptionEn}
               </p>
            </div>
         )}

      </>
   )
}

export default ItemDescription