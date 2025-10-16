import { Shield } from 'lucide-react'
import React from 'react'
import { Badge } from '@/components/shadcnUI/badge'
import { cn } from '@/lib/utils'

type ItemDetailsProps = {
   warrantyEn: string | undefined,
   warrantyAr: string | undefined,
   dir: string
}

const ItemWarranty = ({ warrantyEn, warrantyAr, dir }: ItemDetailsProps) => {
   const warranty = dir === "rtl" ? warrantyAr : warrantyEn;
   
   if (!warranty) return null;

   return (
      <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
         <Badge variant="secondary" className='flex items-center gap-2 font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2 sm:px-3 py-1.5 text-xs sm:text-sm'>
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="break-words">{warranty}</span>
         </Badge>
      </div>
   )
}

export default ItemWarranty