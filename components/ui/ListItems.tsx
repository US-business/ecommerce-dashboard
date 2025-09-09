import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"

type CategoriesProps = {
   items: any[];
   dir: string;
   className?: string;
   title?: string;
   Icons?: Record<string, React.ReactElement>;
}

const ListItems = ({ items, dir, className = '', title = 'The List' , Icons = {} }: CategoriesProps) => {

   return (
      <Card className="md:flex flex-col gap-4 p-4 h-full hidden rounded-md">
         <CardHeader className='text-amber-900 bg-amber-50 flex items-center justify-between p-1 rounded-md w-full'>
            <CardTitle className='text-md text-center font-medium  w-full'>{title}</CardTitle>
         </CardHeader>
         <CardContent className='h-full overflow-hidden'>
            <div className={`flex flex-col gap-4 overflow-y-auto overflow-x-hidden h-full  ${className}`}>
               {items.map((item) => (
                  <div
                     key={item.id}
                     className="flex items-center gap-2 min-w-[200px]"
                  >
                     <div className="relative w-5 h-5 flex items-center">
                        {Icons[item.nameEn] || Icons[item.nameAr] || (
                           <span className='text-center text-2xl text-gray-400'>?</span>)}
                     </div>
                     <p className="flex items-center h-full text-sm font-medium text-gray-700 truncate">
                        {dir === "rtl" ? item.nameAr : item.nameEn}
                     </p>
                  </div>
               ))}
            </div>
         </CardContent>
      </Card>
   )
}

export default ListItems
