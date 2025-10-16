'use client';

import { useSearchStore } from '@/lib/stores/search-store';
import { useEffect } from 'react';
import ProductCard from '../ui/ProductCard/ProductCard';
import ReusablePagination from '../ui/ReusablePagination';
import { useI18nStore } from '@/lib/stores';

interface FilteredProductsProps {
   initialProducts: any[];
   categorySlug?: string;
   totalProducts?: number;
   currentPage?: number;
   limit?: number;
   dir?: string;
   lang?: string;
   showSorting?: boolean;
   showViewToggle?: boolean;
   showPagination?: boolean;
}

export const FilteredProducts = ({
   initialProducts,
   categorySlug,
   totalProducts = 0,
   currentPage = 1,
   limit = 20,
   dir: propDir = 'ltr',
   lang = 'en',
   showSorting = true,
   showViewToggle = true,
   showPagination = true
}: FilteredProductsProps) => {
   const searchStore = useSearchStore(state => state)
   const { dir: storeDir } = useI18nStore()
   const dir = propDir || storeDir
   const {
      query, setQuery,
      categoryId, setCategoryId,
      selectedBrands, toggleBrand,
      priceRange, setPriceRange,
      sortBy, setSortBy,
      numberOfProducts, setNumberOfProducts,
      inStockOnly, setInStockOnly,
      outOfStockOnly, setOutOfStockOnly,
      onSaleOnly, setOnSaleOnly,
      page, setPage,
      total, setTotal,
      clearFilters
   } = searchStore

   // Filter products based on search store state
   const filteredProducts = initialProducts.filter(product => {
      // Price range filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
         return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
         return false;
      }

      // Stock status filters
      if (inStockOnly) {
         // For in-stock filter, check if quantity is available and status is not out_of_stock
         if (product.quantityInStock <= 0) {
            return false;
         }
      }

      if (outOfStockOnly) {
         // For out-of-stock filter, check if quantity is 0 or status is out_of_stock
         if (product.quantityInStock > 0) {
            return false;
         }
      }

      if (onSaleOnly) {
         // For on-sale filter, check if there's an active discount
         if (!product.discountValue && product.discountValue <= 0 && product.discountType === 'none' || product.status === 'on_sale') {
            return false;
         }
      }
      // If all filters pass, return true

      return true;
   });



   // Sort products
   const sortedProducts = [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
         case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
         case 'priceLowHigh':
            return a.price - b.price;
         case 'priceHighLow':
            return b.price - a.price;
         case 'newest':
         default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
   });

   // Update total for pagination
   useEffect(() => {
      setTotal(filteredProducts.length);
   }, [filteredProducts.length, setTotal]);

   // Paginate products
   const ITEMS_PER_PAGE = 12;
   const paginatedProducts = sortedProducts.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
   );

   return (
      <div className="flex-1 space-y-4 sm:space-y-6 min-w-0">
         {/* Results Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
               <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                  {dir === 'rtl'
                     ? `عرض ${paginatedProducts.length} من ${filteredProducts.length} منتج`
                     : `Showing ${paginatedProducts.length} of ${filteredProducts.length} products`
                  }
               </span>
               {filteredProducts.length !== initialProducts.length && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded whitespace-nowrap">
                     {dir === 'rtl' ? 'مفلتر' : 'Filtered'}
                  </span>
               )}
            </div>

            {showSorting && (
               <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap flex-shrink-0">
                     {dir === 'rtl' ? 'ترتيب:' : 'Sort:'}
                  </span>
                  <select
                  title={dir === 'rtl' ? 'ترتيب:' : 'Sort:'}
                     value={sortBy}
                     onChange={(e : any) => setSortBy(e?.target?.value)}
                     className="text-xs sm:text-sm border rounded px-2 py-1.5 sm:py-1 flex-1 sm:flex-initial min-w-0"
                  >
                     <option value="newest">{dir === 'rtl' ? 'الأحدث' : 'Newest'}</option>
                     <option value="oldest">{dir === 'rtl' ? 'الأقدم' : 'Oldest'}</option>
                     <option value="priceLowHigh">{dir === 'rtl' ? 'السعر: منخفض إلى مرتفع' : 'Price: Low to High'}</option>
                     <option value="priceHighLow">{dir === 'rtl' ? 'السعر: مرتفع إلى منخفض' : 'Price: High to Low'}</option>
                  </select>
               </div>
            )}
         </div>

         {/* Products Grid */}
         {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
               {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} dir={dir} lang={lang} />
               ))}
            </div>
         ) : (
            <div className="text-center py-8 sm:py-12 bg-white rounded-lg px-4">
               <div className="text-gray-400 mb-3 sm:mb-4">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
                  </svg>
               </div>
               <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 break-words">
                  {dir === 'rtl' ? 'لا توجد منتجات' : 'No products found'}
               </h3>
               <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 break-words">
                  {dir === 'rtl'
                     ? 'جرب تغيير معايير البحث أو الفلاتر'
                     : 'Try adjusting your search criteria or filters'
                  }
               </p>
               <button
                  onClick={clearFilters}
                  className="text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium"
               >
                  {dir === 'rtl' ? 'مسح جميع الفلاتر' : 'Clear all filters'}
               </button>
            </div>
         )}

         {/* Pagination */}
         {showPagination && paginatedProducts.length > 0 && (
            <div className="flex justify-center">
               <ReusablePagination
                  currentPage={page}
                  totalPages={Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
                  onPageChange={(newPage) => setPage(newPage)}
                  nextLabel={dir === 'rtl' ? 'التالي' : 'Next'}
                  previousLabel={dir === 'rtl' ? 'السابق' : 'Previous'}
               />
            </div>
         )}
      </div>
   );
};