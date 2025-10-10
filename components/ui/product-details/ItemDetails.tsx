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
   return (
      <>
         {(detailsAr || detailsEn || brand) && (
            <div className={cn(dir === "rtl" && "text-left")}>
               {dir === "rtl" ? <>
                  <h3 className={cn("font-mono font-bold text-lg mb-3")}>{"تفاصيل المنتج"}</h3>
               </> : <>
                  <h3 className="font-semibold text-lg mb-3">{"Product Details"}</h3>
               </>
               }
               {brand && (
                  <div className={cn("flex items-center gap-3 border-b border-gray-200 py-2", dir === "rtl" && "space-x-reverse")}>
                     <span className='rounded-full p-1 bg-gray-200'>
                        <Check className={cn("h-4 w-4 text-green-600 flex-shrink-0")} />
                     </span>
                     <div className="text-gray-700 flex flex-nowrap gap-4">
                        <span className=" w-25">
                           {dir === "rtl" ? "العلامة التجارية" : "Brand"}
                        </span> :
                        <span>{brand}</span>
                     </div>
                  </div>
               )}

                  {detailsAr && detailsAr.length > 0 && dir === "rtl" ? (
                     detailsAr.map((detail, index) => (
                        <ul key={index} className="space-y-2">
                        <li className={cn("flex items-center gap-3 border-b border-gray-200 py-2", dir === "rtl" && "space-x-reverse")}>
                           <span className='rounded-full p-1 bg-gray-200'>
                              <Check className={cn("h-4 w-4 text-green-600 flex-shrink-0 ")} />
                           </span>
                           <div className="text-gray-700 flex flex-nowrap gap-4">
                              <span className='w-25 '>{detail.title}</span> :
                              <span>{detail.description}</span>
                           </div>
                        </li>
                        </ul>
                     ))
                  ) : null}
                  {detailsEn && detailsEn.length > 0 && dir === "ltr" ? (
                     detailsEn.map((detail, index) => (
                        <ul key={index} className="space-y-2">
                        <li className={cn("flex items-center gap-3 border-b border-gray-200 py-2", dir === "ltr" && "space-x-reverse")}>
                           <span className='rounded-full p-1 bg-gray-200'>
                              <Check className={cn("h-4 w-4 text-green-600 flex-shrink-0 ")} />
                           </span>
                           <div className="text-gray-700 flex justify-between flex-nowrap gap-4">
                              <span className='w-25'>{detail.title}</span>
                              <span>:</span>
                              <span>{detail.description}</span>
                           </div>
                        </li>
                        </ul>
                        ))
                  ) : null}
            </div>
         )}
      </>
   )
}

export default ItemDetails