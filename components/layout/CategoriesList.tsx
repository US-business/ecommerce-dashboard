import React from 'react'
import {
   Tv,
   Refrigerator,
   Laptop,
   CookingPot,
   Sofa,
   Shirt,
   Camera,
   LibraryBig,
   Smartphone,
   TabletSmartphone,
   Dumbbell,
   ShoppingBag,
   Cpu,
   ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/category';
import type { Locale } from '@/lib/i18n/i18n-config';

type CategoriesListProps = {
   categories: Category[];
   dictionary: Record<string, any>;
   dir: string;
   lang?: Locale;
   className?: string
}

// Icon mapping function for better maintainability
const getCategoryIcon = (categoryName: string): React.ReactNode => {
   const iconMap: Record<string, React.ReactNode> = {
      // Kitchen & Cooking
      "Kitchen": <CookingPot className="w-5 h-5 sm:w-6 sm:h-6" />,

      // Electronics & Technology
      "Electronics": <Camera className="w-5 h-5 sm:w-6 sm:h-6" />,
      "TV": <Tv className="w-5 h-5 sm:w-6 sm:h-6" />,
      "TVs": <Tv className="w-5 h-5 sm:w-6 sm:h-6" />,
      "Laptop": <Laptop className="w-5 h-5 sm:w-6 sm:h-6" />,
      "Laptops": <Laptop className="w-5 h-5 sm:w-6 sm:h-6" />,

      // Appliances
      "Large Home Appliances": <Refrigerator className="w-5 h-5 sm:w-6 sm:h-6" />,
      "Electrical Appliances": <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />,
      "Appliances": <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />,

      // Furniture & Home
      "Home & Furniture": <Sofa className="w-5 h-5 sm:w-6 sm:h-6" />,
      "Furniture": <Sofa className="w-5 h-5 sm:w-6 sm:h-6" />,

      // Fashion & Clothing
      "Fashion": <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />,
      "Clothes": <Shirt className="w-5 h-5 sm:w-6 sm:h-6" />,

      // Education & School
      "School": <LibraryBig className="w-5 h-5 sm:w-6 sm:h-6" />,
      "School Supplies": <LibraryBig className="w-5 h-5 sm:w-6 sm:h-6" />,

      // Mobile & Communication
      "Mobile Phones": <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />,
      "phones": <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />,
      "Mobile & Tablets": <TabletSmartphone className="w-5 h-5 sm:w-6 sm:h-6" />,

      // Sports & Recreation
      "Sport": <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6" />,
      "Sporting Goods": <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6" />
   };

   return iconMap[categoryName] || <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />;
};

const CategoriesList = ({ categories, dictionary, dir, lang = 'ar', className }: CategoriesListProps) => {
   if (!categories || categories.length === 0) return null

   const title = typeof dictionary?.categories?.title === 'object'
      ? dictionary.categories.title[dir] || dictionary.categories.title
      : dictionary?.categories?.title || (dir === 'rtl' ? 'الفئات' : 'Categories');

   return (
      <Card className={cn("relative z-10 flex flex-col gap-3 sm:gap-4  lg:w-[280px] xl:w-[290px] py-2",
         "shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-xl", className)}>

         {/* <CardHeader className='bg-gradient-to-r from-amber-500 to-amber-600 p-2 rounded-lg'>
            <CardTitle className='text-base sm:text-md font-bold text-white text-center flex items-center justify-center gap-2'>
               <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
               <span>{title}</span>
            </CardTitle>
         </CardHeader> */}

         <CardContent className='overflow-hidden'>
            <div className={cn("flex flex-col gap-1",
               " overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent ",
               "hover:scrollbar-thumb-amber-300",
               "")}>
               {categories.map((category) => {
                  const categoryName = dir === 'rtl' ? category.nameAr : category.nameEn;
                  const icon = getCategoryIcon(category.nameEn);

                  return (
                     <Link
                        key={category.id}
                        href={`/${lang}/category/${category.slug}`}
                        className={cn(
                           "flex items-center gap-2 sm:gap-3 w-full",
                           "text-gray-700 text-sm",
                           "hover:text-amber-800",
                           "transition-all duration-200 ease-in-out",
                        )}
                        title={categoryName}
                     >
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-amber-50 group-hover:bg-amber-100 transition-colors">
                           <div className="text-amber-600 group-hover:text-amber-700 transition-colors">
                              {icon}
                           </div>
                        </div>

                        <span className={cn("flex-1 text-sm sm:text-lg font-medium text-gray-700 group-hover:text-amber-900 truncate transition-colors")}>
                           {categoryName}
                        </span>

                        <ChevronRight className={cn(
                           "w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-all",
                           "group-hover:translate-x-1",
                           dir === 'rtl' && "rotate-180 group-hover:-translate-x-1"
                        )} />
                     </Link>
                  )
               })}
            </div>
         </CardContent>
      </Card>
   )
}

export default CategoriesList