import { Shield } from 'lucide-react'
import React from 'react'
import { Badge } from '../../shadcnUI/badge'
import { cn } from '@/lib/utils'

type ItemDetailsProps = {
   warrantyEn: string | undefined,
   warrantyAr: string | undefined,
   dir: string
}

const ItemWarranty = ({ warrantyEn, warrantyAr, dir }: ItemDetailsProps) => {


   return (
      <>
         {/* Quality Guarantee */}
         {dir === "rtl" ? (
            warrantyAr && (
               <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className='font-mono font-semibold bg-amber-600 text-white w-fit'>
                     <Shield className="h-5 w-5 text-white font-bold " />
                     {warrantyAr}
                  </Badge>
               </div>
            )
         ) : null}
         {dir === "ltr" ? (
            warrantyEn && (
               <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className='font-semibold bg-amber-600 text-white w-fit'>
                     {warrantyEn}
                     <Shield className="h-5 w-5 text-white font-bold " />
                  </Badge>
               </div>
            )
         ) : null
         }
      </>
   )
}

export default ItemWarranty