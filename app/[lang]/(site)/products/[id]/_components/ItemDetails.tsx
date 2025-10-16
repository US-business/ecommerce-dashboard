import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import React from 'react'

type ItemDetailsProps = {
   dir: string
   detailsAr?: any[]
   detailsEn?: any[]
   brand?: string
}


const ItemDetails = ({ dir, detailsAr, detailsEn, brand }: ItemDetailsProps) => {
   const details = dir === "rtl" ? detailsAr : detailsEn;
   const hasDetails = details && details.length > 0;

   if (!hasDetails) return null;

   return (
      <div className={cn("space-y-2")}>
         <h3 className="font-semibold text-base sm:text-lg mb-3">
            {dir === "rtl" ? "المواصفات السريعة" : "Quick Specifications"}
         </h3>
         <ul className="space-y-2">
            {details.map((detail, index) => (
               <li
                  key={index}
                  className={cn("flex items-start gap-2 sm:gap-3 border-b border-gray-200 py-2.5 hover:bg-gray-50 px-2 rounded transition-colors")}
               >
                  <span className='rounded-full p-1 bg-green-100 flex-shrink-0 mt-0.5'>
                     <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-600" />
                  </span>
                  <div className={cn("text-xs sm:text-sm text-gray-700 flex flex-col sm:grid sm:grid-cols-2 gap-1 sm:gap-2  min-w-0")}>
                     <span className="font-medium text-gray-900 break-words">{detail.title}:</span>
                     <span className="text-gray-600 break-words">{detail.description}</span>
                  </div>
               </li>
            ))}
         </ul>
      </div>
   )
}

export default ItemDetails