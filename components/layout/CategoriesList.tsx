"use client"

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
   Cpu
} from "lucide-react";
import ListItems from '../ui/ListItems';
import type { Category, CategoryIconMapping } from '@/types/category';

type CategoriesListProps = {
   categories: Category[];
   dictionary: Record<string, any>;
   dir: string;
}

const CategoriesList = ({ categories, dictionary, dir }: CategoriesListProps) => {
   if (!categories || categories.length === 0) return null

   // Standardized icon mapping with consistent sizing and no duplicates
   const categoryIcons: CategoryIconMapping = {
      // Kitchen & Cooking
      "Kitchen": <CookingPot className="w-6 h-6" />,

      // Electronics & Technology
      "Electronics": <Camera className="w-6 h-6" />,
      "TV": <Tv className="w-6 h-6" />,
      "TVs": <Tv className="w-6 h-6" />,
      "Laptop": <Laptop className="w-6 h-6" />,
      "Laptops": <Laptop className="w-6 h-6" />,

      // Appliances
      "Large Home Appliances": <Refrigerator className="w-6 h-6" />,
      "Electrical Appliances": <Cpu className="w-6 h-6" />,
      "Appliances": <Cpu className="w-6 h-6" />,

      // Furniture & Home
      "Home & Furniture": <Sofa className="w-6 h-6" />,
      "Furniture": <Sofa className="w-6 h-6" />,

      // Fashion & Clothing
      "Fashion": <ShoppingBag className="w-6 h-6" />,
      "Clothes": <Shirt className="w-6 h-6" />,

      // Education & School
      "School": <LibraryBig className="w-6 h-6" />,
      "School Supplies": <LibraryBig className="w-6 h-6" />,

      // Mobile & Communication
      "Mobile Phones": <Smartphone className="w-6 h-6" />,
      "phones": <Smartphone className="w-6 h-6" />,
      "Mobile & Tablets": <TabletSmartphone className="w-6 h-6" />,

      // Sports & Recreation
      "Sport": <Dumbbell className="w-6 h-6" />,
      "Sporting Goods": <Dumbbell className="w-6 h-6" />
   };

   return (
      <ListItems
         items={categories}
         dir={dir}
         title={dictionary.categories.title}
         Icons={categoryIcons}
      />
   )
}

export default CategoriesList