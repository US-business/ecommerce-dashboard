import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { useTranslation } from '@/hooks/use-translation'
import type { Category } from '@/types/category'

type ListItemsProps = {
   items: Category[];
   dir: string;
   className?: string;
   title?: string | Record<string, string>;
   Icons?: Record<string, React.ReactElement>;
}

const ListItems = ({ items, dir, className = '', title = 'The List' , Icons = {} }: ListItemsProps) => {
   const { getLocalizedField } = useTranslation()

   return (
      <Card className="flex flex-col gap-4 p-4 h-full min-w-[280px] min-h-[300px] md:h-[400px] shadow-md rounded-md">
         <CardHeader className='text-amber-900 bg-amber-50 flex items-center justify-between p-2 rounded-md w-full'>
            <CardTitle className='text-md text-center font-medium w-full'>
               {typeof title === 'string' ? title : title[dir]}
            </CardTitle> 
         </CardHeader>
         <CardContent className='h-full overflow-hidden p-2'>
            <div className={`flex flex-col gap-2 overflow-y-auto overflow-x-hidden h-full ${className}`}>
               {items?.map((item) => (
                  <div 
                     key={item.id}
                     className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                     <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        {Icons[item.nameEn] || Icons[item.nameAr] || (
                           <span className='text-center text-lg text-gray-400'>?</span>
                        )}
                     </div>
                     <p className="flex-1 text-sm font-medium text-gray-700 truncate" title={getLocalizedField(item, 'name')}>
                        {getLocalizedField(item, 'name')}
                     </p>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
   )
}

export default ListItems
