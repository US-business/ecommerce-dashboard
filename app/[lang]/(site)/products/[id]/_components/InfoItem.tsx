"use client"
import { cn } from '@/lib/utils'
import { RotateCcw, Share2, Shield, Truck } from 'lucide-react'
import React from 'react'
import { Badge } from '@/components/shadcnUI/badge'
import { ProductProps } from '@/types/product'
import { Button } from '@/components/shadcnUI/button'
import { useRouter } from "next/navigation"
import ItemPrice from './ItemPrice'
import ItemStock from './ItemStock'
import ItemDetails from './ItemDetails'
import ItemDescription from './ItemDescription'
import { Separator } from '@/components/shadcnUI/separator'
import ItemWarranty from './ItemWarranty'
import AddToCard from './AddToCard'
import Quantity from './ItemQuantity'
import WishlistButton from '@/components/ui/WishlistButton'


type InfoItemProps = {
   product: ProductProps,
   dir: string,
   lang?: string,
   reviews?: number,
}
const InfoItem = ({ product, dir, lang = 'ar', reviews }: InfoItemProps) => {
   const router = useRouter()

   const handleBuyNow = () => {
      // Buy now logic here
      router.push(`/${lang}/checkout`)
   }

   const handleShare = async () => {
      const shareData = {
         title: dir === "rtl" ? product.nameAr : product.nameEn,
         text: dir === "rtl" ? product.descriptionAr : product.descriptionEn,
         url: window.location.href,
      };

      if (navigator.share) {
         try {
            await navigator.share(shareData);
         } catch (err) {
            console.log('Error sharing:', err);
         }
      } else {
         // Fallback: copy to clipboard
         navigator.clipboard.writeText(window.location.href);
         alert(dir === "rtl" ? "تم نسخ الرابط" : "Link copied!");
      }
   };


   return (
      <div className={cn("space-y-6")}>
         {/* Header Section - Responsive Layout */}
         <div className="flex flex-col gap-4 mb-6">
            {/* Badges and Action Buttons - Mobile First */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
               <div className="flex flex-wrap items-center gap-2">
                  {product.status !== "normal" && (
                     <Badge variant="secondary" className={cn('text-xs bg-amber-600 hover:bg-amber-500 select-none text-white font-semibold')}>
                        {product.status}
                     </Badge>
                  )}
                  {product.quantityInStock === 0 && (
                     <Badge variant="destructive" className='text-xs font-semibold'>
                        {dir === "rtl" ? "نفذ من المخزون" : "Out of Stock"}
                     </Badge>
                  )}
               </div>
               
               <div className="flex gap-2 self-start sm:self-auto">
                  <WishlistButton
                     productId={Number(product.id)}
                     dir={dir}
                     lang={lang}
                  />
                  <Button
                     variant="outline"
                     size="icon"
                     onClick={handleShare}
                     title={dir === "rtl" ? "مشاركة" : "Share"}
                     className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                     <Share2 className="h-4 w-4" />
                  </Button>
               </div>
            </div>

            {/* Product Title */}
            <h2 className={cn("text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight")}>
               {dir === "rtl" ? product.nameAr : product.nameEn}
            </h2>

            {/* SKU & Brand - Responsive Layout */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm">
               {product.brand && (
                  <div className="flex items-center gap-2">
                     <span className="text-lg">🏷️</span>
                     <span className="text-gray-500 font-medium">{dir === "rtl" ? "الماركة :" : "Brand:"}</span>
                     <span className="text-blue-700 font-bold">{product.brand}</span>
                  </div>
               )}
               {product.sku && (
                  <div className="flex items-center gap-2">
                     <span className="text-gray-500 font-medium">{dir === "rtl" ? "رقم المنتج :" : "SKU:"}</span>
                     <span className="text-gray-900 font-semibold">{product.sku}</span>
                  </div>
               )}
            </div>
         </div>

         {/* Price */}
         <ItemPrice originalPrice={product.price} discountType={product.discountType} discount={product.discountValue} dir={dir} />
         <ItemWarranty warrantyEn={product.warrantyEn} warrantyAr={product.warrantyAr} dir={dir} />
         <Separator className="my-2" />
         {/* Stock */}
         <ItemStock quantityInStock={product.quantityInStock} dir={dir} />
         <Separator className="my-2" />

         {/* Product Details */}
         <ItemDetails dir={dir} detailsAr={product.detailsAr} detailsEn={product.detailsEn} brand={product.brand} />

         {/* Description */}
         <ItemDescription dir={dir} descriptionAr={product.descriptionAr} descriptionEn={product.descriptionEn} />


         {/* Quantity and Actions - Responsive Layout */}
         <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
               <div className="w-full sm:w-auto sm:flex-shrink-0">
                  <Quantity dir={dir} productData={product} />
               </div>
               <div className="w-full sm:flex-1 sm:min-w-0">
                  <AddToCard productData={product} dir={dir} lang={lang} />
               </div>
            </div>
            <Button
               onClick={handleBuyNow}
               variant="default"
               className={cn("w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold shadow-md hover:shadow-lg transition-all text-sm sm:text-base")}
               size="lg"
               disabled={product.quantityInStock === 0}
            >
               <span className="truncate">{dir === "rtl" ? "🛒 اشتري الآن" : "🛒 Buy Now"}</span>
            </Button>
         </div>
         {/* Shipping Info - Enhanced Responsive Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t">
            <div className={cn("flex items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-green-50 border border-green-200")}>
               <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-1 sm:mt-0" />
               <div className={cn("flex-1 min-w-0", dir === "rtl" && "text-right")}>
                  <p className="font-semibold text-xs sm:text-sm text-gray-900 break-words">{dir === "rtl" ? "شحن مجاني" : "Free Shipping"}</p>
                  <p className="text-xs text-gray-600 mt-0.5 break-words">{dir === "rtl" ? "للطلبات فوق $50" : "On orders over $50"}</p>
               </div>
            </div>
            <div className={cn("flex items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-blue-50 border border-blue-200")}>
               <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-1 sm:mt-0" />
               <div className={cn("flex-1 min-w-0", dir === "rtl" && "text-right")}>
                  <p className="font-semibold text-xs sm:text-sm text-gray-900 break-words">{dir === "rtl" ? "إرجاع سهل" : "Easy Returns"}</p>
                  <p className="text-xs text-gray-600 mt-0.5 break-words">{dir === "rtl" ? "خلال 30 يوم" : "Within 30 days"}</p>
               </div>
            </div>
            <div className={cn("flex items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-purple-50 border border-purple-200 sm:col-span-2 lg:col-span-1")}>
               <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0 mt-1 sm:mt-0" />
               <div className={cn("flex-1 min-w-0", dir === "rtl" && "text-right")}>
                  <p className="font-semibold text-xs sm:text-sm text-gray-900 break-words">{dir === "rtl" ? "ضمان الجودة" : "Quality Guarantee"}</p>
                  <p className="text-xs text-gray-600 mt-0.5 break-words">{dir === "rtl" ? "ضمان لمدة سنة" : "1 year warranty"}</p>
               </div>
            </div>
         </div>
      </div>
   )
}

export default InfoItem