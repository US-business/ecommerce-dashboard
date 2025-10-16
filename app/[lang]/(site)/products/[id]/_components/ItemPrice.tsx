import React from 'react'
import { Badge } from '@/components/shadcnUI/badge'

type ItemPriceProps = {
   originalPrice: string | undefined,
   discountType: string | undefined, 
   discount: number | undefined,
   dir: string
}


const ItemPrice = ({ originalPrice, discount, discountType , dir }: ItemPriceProps) => {

      const price = Number(originalPrice) || 0;
   const discountValue = Number(discount) || 0;

   const hasDiscount: boolean =
      discountType !== "none" && discountValue > 0;

   const discountedPrice: number = hasDiscount
      ? price - (discountType === "fixed"
         ? discountValue
         : (price * discountValue) / 100)
      : price;


   return (
      <>
         {price && (
            <>
               {hasDiscount ? (
                  <div className='flex flex-col space-y-3'>
                     {dir === "rtl" ? <>
                        <Badge variant="destructive" className='font-mono text-white w-fit text-xs sm:text-sm'>
                           -%{discountValue} {"خصم"}
                        </Badge>
                     </> : <>
                        <Badge variant="destructive" className='font-mono text-white w-fit text-xs sm:text-sm'>
                           -{discountValue}% {"OFF"}
                        </Badge>
                     </>
                     }
                     {/* discount price */}
                     <div className='flex flex-col space-y-2'>
                        {dir === "rtl" ? <>
                           <span className="text-2xl sm:text-3xl font-bold">
                              {discountedPrice.toFixed(2)}
                              <span className='text-base sm:text-lg font-mono text-gray-400'>{" جنية"}</span>
                           </span>
                        </> : <>
                           <span className="text-2xl sm:text-3xl font-bold">
                              <span className='text-base sm:text-xl text-gray-400'>{"EGP "}</span>
                              {discountedPrice.toFixed(2)}
                           </span>
                        </>
                        }
                        {/* saved price */}
                        {dir === "rtl" ? <>
                           <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 font-bold'>
                              <span className="text-base sm:text-xl text-gray-500 line-through">
                                 <span className='font-bold'>EGP </span>
                                 {price.toFixed(2)}
                              </span>
                              <div className='bg-amber-400 font-bold text-xs sm:text-sm px-2 py-1 rounded-lg w-fit'>
                                 <span className='font-mono'>
                                    {"وفر "}
                                    <span className='text-sm sm:text-lg text-black'>{(price - discountedPrice).toFixed(2)}</span>
                                    {" جنية"}</span>
                              </div>
                           </div>
                        </> : <>
                           <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 font-bold'>
                              <span className="text-base sm:text-xl text-gray-500 line-through">
                                 <span className='font-bold'>EGP </span>
                                 {price.toFixed(2)}
                              </span>
                              <span className='bg-amber-400 font-bold text-xs sm:text-sm px-2 py-1 rounded-lg w-fit'>
                                 {"EGP "}
                                 <span className='text-sm sm:text-lg text-black'>{(price - discountedPrice).toFixed(2)}</span>
                                 {" (Saved)"}
                              </span>
                           </div>
                        </>
                        }
                     </div>
                  </div>
               ) : <>
                  <div className="text-2xl sm:text-3xl font-bold">
                     {dir === "rtl" ? <>
                        {price.toFixed(2)}
                        <span className='text-base sm:text-lg font-mono text-gray-400'>
                           {" جنية"}
                        </span>
                     </> : <>
                        <span className='text-base sm:text-lg text-gray-400'>
                           {dir === "rtl" ? "جنية " : "EGP "}
                        </span>
                        {price.toFixed(2)}
                     </>}
                  </div>
               </>}
            </>
         )}
      </>
   )
}

export default ItemPrice