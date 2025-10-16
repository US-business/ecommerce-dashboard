import { cn } from '@/lib/utils'
import React from 'react'

type ItemDescriptionProps = {
   dir: string
   descriptionAr?: string
   descriptionEn?: string
}


const ItemDescription = ({ dir, descriptionAr, descriptionEn }: ItemDescriptionProps) => {
   const description = dir === "rtl" ? descriptionAr : descriptionEn;
   
   if (!description) return null;

   return (
      <div className={cn("space-y-2 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100")}>
         <h4 className="font-semibold text-sm sm:text-base text-blue-900">
            {dir === "rtl" ? "📝 وصف مختصر" : "📝 Brief Description"}
         </h4>
         <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">
            {description}
         </p>
      </div>
   )
}

export default ItemDescription