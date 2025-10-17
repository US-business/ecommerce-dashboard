import { Shield } from 'lucide-react'
import React from 'react'
import { Badge } from '../shadcnUI/badge'

type ItemDetailsProps = {
   warrantyEn: string | undefined,
   warrantyAr: string | undefined,
   dir: string
}

const ItemWarranty = ({ warrantyEn, warrantyAr, dir }: ItemDetailsProps) => {

   return (
      <>
         {warrantyEn && warrantyAr && dir === "rtl" ?
            <div className='flex'>
               <Badge variant="secondary" className='font-mono font-semibold text-sm bg-amber-600 text-white '>
                  <Shield />
                  {warrantyAr}
               </Badge>
            </div>
            : <Badge variant="secondary"
               className='font-semibold text-sm bg-amber-600 text-white'>
               <Shield />
               {warrantyEn}
            </Badge>}
      </>
   )
}

export default ItemWarranty