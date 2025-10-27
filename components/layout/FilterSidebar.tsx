'use client';

import { useState } from 'react';
import { useSearchStore } from '@/lib/stores/search-store';
import { Button } from '@/components/shadcnUI/button';
import { ScrollArea } from '@/components/shadcnUI/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/shadcnUI/sheet';
import { SlidersIcon } from 'lucide-react';
import { useI18nStore } from '@/lib/stores';
import SearchFilters from './SearchFilters';

interface FilterSidebarProps {
   brands: string[];
   categories?: Array<{ id: number; nameEn: string; nameAr: string }>;
   dir: 'rtl' | 'ltr';
   showCategories?: boolean;
   showPriceRange?: boolean;
   showBrands?: boolean;
}

export const FilterSidebar = ({ 
   brands, 
   categories = [], 
   dir, 
   showCategories = false,
   showPriceRange = true,
   showBrands = true
}: FilterSidebarProps) => {

   const { t, locale } = useI18nStore();
   const [isOpen, setIsOpen] = useState(false);

   const {
      priceRange,
      setPriceRange,
      selectedBrands,
      toggleBrand,
      inStockOnly,
      setInStockOnly,
      outOfStockOnly,
      setOutOfStockOnly,
      onSaleOnly,
      setOnSaleOnly,
      sortBy,
      setSortBy,
      clearFilters,
   } = useSearchStore();

   // Shared props for SearchFilters
   const searchFiltersProps = {
      t,
      locale,
      categories: showCategories ? categories : undefined,
      brands: showBrands ? brands : [],
      sortBy,
      setSortBy,
      selectedBrands,
      toggleBrand,
      priceRange: showPriceRange ? priceRange : [0, 10000],
      setPriceRange,
      inStockOnly,
      setInStockOnly,
      outOfStockOnly,
      setOutOfStockOnly,
      onSaleOnly,
      setOnSaleOnly,
      clearFilters,
   };

   return (
      <>
         {/* Mobile Filter Button */}
         <div className="lg:hidden w-full flex justify-end mb-3 sm:mb-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
               <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 py-2">
                     <SlidersIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                     <span className="whitespace-nowrap">{dir === 'rtl' ? 'الفلتر' : 'Filter'}</span>
                  </Button>
               </SheetTrigger>
               <SheetContent 
                  side={dir === 'rtl' ? 'right' : 'left'} 
                  className="w-[350px] sm:w-[400px] p-0"
               >
                  <ScrollArea className="h-full p-4">
                     <SearchFilters
                        classNames='flex flex-col'
                        {...searchFiltersProps}
                     />
                  </ScrollArea>
               </SheetContent>
            </Sheet>
         </div>

         {/* Desktop Sidebar */}
         <SearchFilters
            classNames='hidden lg:flex'
            {...searchFiltersProps}
         />
      </>
   );
};