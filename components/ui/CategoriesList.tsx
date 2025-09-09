"use client"

import React from 'react'
import { useAppStore, useI18nStore } from '@/lib/stores';
import { Tv, Refrigerator, Laptop, CookingPot, Sofa, Shirt, Camera, LibraryBig, Smartphone, TabletSmartphone, Dumbbell } from "lucide-react";
import ListItems from './ListItems';


const CategoriesList = () => {
   const { categories } = useAppStore()
   const { t, dir } = useI18nStore()

   const categoryIcons: Record<string, React.ReactElement> = {
      Kitchen: <CookingPot className="w-6 h-6" />,
      TVs: <Tv className="w-6 h-6 " />,
      TV: <Tv className="w-6 h-6 " />,
      "Electronics": <Camera className="w-6 h-6 " />,
      "Electrical Appliances": <Tv className="w-6 h-6 " />,
      "Appliances": <Tv className="w-6 h-6 " />,
      "Large Home Appliances": <Refrigerator className="w-6 h-6 " />,
      Laptop: <Laptop className="w-6 h-6 " />,
      "Home & Furniture": <Sofa className="w-6 h-6 " />,
      "Furniture": <Sofa className="w-6 h-6 " />,
      "Fashion": <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M2.048 18.566A2 2 0 0 0 4 21h16a2 2 0 0 0 1.952-2.434l-2-9A2 2 0 0 0 18 8H6a2 2 0 0 0-1.952 1.566z" /><path d="M8 11V6a4 4 0 0 1 8 0v5" /></svg>,
      "Clothes": <Shirt className='w-6 h-6 ' />,
      "School": <LibraryBig className="w-6 h-6 " />,
      "School Supplies": <LibraryBig className="w-6 h-6 " />,
      "phones": <Smartphone className="w-6 h-6 " />,
      "Mobile Phones": <Smartphone className="w-6 h-6 " />,
      "Mobile & Tablets": <TabletSmartphone className="w-6 h-6 " />,
      "Sport": <Dumbbell className='w-6 h-6 ' />,
      "Sporting Goods": <Dumbbell className='w-6 h-6 ' />
   };

   return (
      <ListItems items={categories} dir={dir} title={t("common.categories")} Icons={categoryIcons} />
   )
}

export default CategoriesList













// import React from 'react'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card"
// import { useI18nStore } from '@/lib/stores';
// import { Tv, Refrigerator, Laptop, CookingPot, Sofa, Shirt, Camera, LibraryBig, Smartphone, TabletSmartphone, Dumbbell  } from "lucide-react";

// type CategoriesProps = {
//    items: any[];
//    dir: string;
//    className?: string;
// }

// const CategoriesList = ({ items, dir, className }: CategoriesProps) => {
//    const { t } = useI18nStore()

//    const categoryIcons: Record<string, React.ReactElement> = {
//       Kitchen: <CookingPot className="w-6 h-6" />,
//       TVs: <Tv className="w-6 h-6 " />,
//       TV: <Tv className="w-6 h-6 " />,
//       "Electronics": <Camera  className="w-6 h-6 " />,
//       "Electrical Appliances": <Tv className="w-6 h-6 " />,
//       "Appliances": <Tv className="w-6 h-6 " />,
//       "Large Home Appliances": <Refrigerator className="w-6 h-6 " />,
//       Laptop: <Laptop className="w-6 h-6 " />,
//       "Home & Furniture": <Sofa className="w-6 h-6 " />,
//       "Furniture": <Sofa className="w-6 h-6 " />,
//       "Fashion": <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M2.048 18.566A2 2 0 0 0 4 21h16a2 2 0 0 0 1.952-2.434l-2-9A2 2 0 0 0 18 8H6a2 2 0 0 0-1.952 1.566z"/><path d="M8 11V6a4 4 0 0 1 8 0v5"/></svg>,
//       "Clothes" : <Shirt className='w-6 h-6 ' />,
//       "School" : <LibraryBig className="w-6 h-6 "/>,
//       "School Supplies" : <LibraryBig className="w-6 h-6 "/>,
//       "phones" : <Smartphone className="w-6 h-6 "/>,
//       "Mobile Phones" : <Smartphone className="w-6 h-6 "/>,
//       "Mobile & Tablets" : <TabletSmartphone className="w-6 h-6 "/>,
//       "Sport" : <Dumbbell className='w-6 h-6 ' />,
//       "Sporting Goods" : <Dumbbell className='w-6 h-6 ' />
//    };

//    return (
//       <Card className="md:flex flex-col gap-4 p-4 h-full hidden rounded-md">
//          <CardHeader className='text-amber-900 bg-amber-50 flex items-center justify-between p-1 rounded-md w-full'>
//             <CardTitle className='text-md text-center font-medium  w-full'>{t("common.categories")}</CardTitle>
//          </CardHeader>
//          <CardContent className='h-full overflow-hidden'>
//             <div className={`flex flex-col gap-4 overflow-y-auto overflow-x-hidden h-full  ${className}`}>
//                {items.map((category) => (
//                   <div
//                      key={category.id}
//                      className="flex items-center gap-2 min-w-[200px]"
//                   >
//                      <div className="relative w-5 h-5 flex items-center">
//                         {categoryIcons[category.nameEn] || categoryIcons[category.nameAr] || (
//                         <span className='text-center text-2xl text-gray-400'>?</span> )}
//                      </div>
//                      <p className="flex items-center h-full text-sm font-medium text-gray-700 truncate">
//                         {dir === "rtl" ? category.nameAr : category.nameEn}
//                      </p>
//                   </div>
//                ))}
//             </div>
//          </CardContent>
//       </Card>
//    )
// }

// export default CategoriesList
