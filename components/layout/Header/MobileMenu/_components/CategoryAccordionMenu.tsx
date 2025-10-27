"use client";
import React from "react";
import { Grid3x3, ChevronRight } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/shadcnUI/accordion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CategoryAccordionMenuProps {
   categories: any[] | undefined;
   dir: "ltr" | "rtl";
   lang?: string;
   onCategoryClick: () => void;
}

const CategoryAccordionMenu = ({ categories, dir, lang = 'en', onCategoryClick }: CategoryAccordionMenuProps) => {
   if (!categories || categories.length === 0) {
      return null;
   }

   return (
      <div className="border-t border-slate-200 bg-gradient-to-b from-white to-slate-50/50">
         <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="categories" className="border-none">
               <AccordionTrigger className={cn(
                  "px-4 py-4 hover:no-underline transition-colors",
                  "hover:bg-amber-50/50",
               )}>
                  <div className={cn(
                     "flex items-center gap-3",
                  )}>
                     <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-sm">
                        <Grid3x3 className="w-5 h-5 text-amber-700" />
                     </div>
                     <span className="text-base font-bold bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
                        {dir === 'rtl' ? 'الفئات' : 'Categories'}
                     </span>
                  </div>
               </AccordionTrigger>
               
               <AccordionContent className="px-4 pb-4 bg-white">
                  <div className="space-y-1">
                     {categories.map((category, index) => (
                        <Link
                           key={category.id}
                           href={`/${lang}/category/${category.slug}`}
                           onClick={onCategoryClick}
                           className={cn(
                              "flex items-center justify-between group",
                              "px-4 py-3 rounded-lg",
                              "text-sm font-medium text-slate-700",
                              "hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50",
                              "hover:text-amber-700 hover:shadow-sm",
                              "transition-all duration-200",
                              "border border-transparent hover:border-amber-200",
                           )}
                           style={{
                              animationDelay: `${index * 30}ms`
                           }}
                        >
                           <span className="font-semibold">{dir === 'rtl' ? category.nameAr : category.nameEn}</span>
                           <ChevronRight className={cn(
                              "w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-all group-hover:translate-x-1",
                              dir === "rtl" && "rotate-180 group-hover:-translate-x-1"
                           )} />
                        </Link>
                     ))}
                  </div>
               </AccordionContent>
            </AccordionItem>
         </Accordion>
      </div>
   );
};

export default CategoryAccordionMenu;
