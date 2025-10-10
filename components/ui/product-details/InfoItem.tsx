"use client"
import { cn } from '@/lib/utils'
import { Check, Heart, Minus, Plus, RotateCcw, Share2, Shield, ShoppingCart, Star, Truck } from 'lucide-react'
import React, { useState } from 'react'
import { Badge } from '../../shadcnUI/badge'
import { ProductProps } from '@/types/product'
import { Button } from '../../shadcnUI/button'
import { useRouter } from "next/navigation"
import ItemPrice from './ItemPrice'
import ItemStock from './ItemStock'
import ItemDetails from './ItemDetails'
import ItemDescription from './ItemDescription'
import { Separator } from '../../shadcnUI/separator'
import ItemWarranty from './ItemWarranty'
import ItemQuantity from './ItemQuantity'
import AddToCard from '../AddToCard'
import Quantity from './ItemQuantity'


type InfoItemProps = {
   product: ProductProps,
   dir: string,
   reviews?: number,
}
const InfoItem = ({ product, dir, reviews }: InfoItemProps) => {

   const router = useRouter()






   // const averageRating =
   //    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0


   const renderStars = (rating: number) => {
      return Array.from({ length: 5 }, (_, i) => (
         <Star
            key={i}
            className={cn("h-4 w-4", i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300")}
         />
      ))
   }

   const handleBuyNow = () => {
      // Buy now logic here
      router.push("/checkout")
   }



   return (
      <div className={cn("space-y-6", dir === "rtl" && "text-right")}>
         <div>
            {product.status !== "normal" ? <Badge variant="secondary"
               className='text-xs bg-amber-600 text-white'>
               {product.status}
            </Badge> : null}
            {dir === "rtl" ? <>
               <h2 className="text-2xl font-bold text-gray-900 mb-2 text-left">
                  {product.nameAr}
               </h2>
            </> : <>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.nameEn}
               </h2>
            </>}
            <div className={cn("flex items-center space-x-4 mb-4", dir === "rtl" && "space-x-reverse")}>
               <div className={cn("flex items-center space-x-1", dir === "rtl" && "space-x-reverse")}>
                  {/* {renderStars(averageRating)} */}
                  <span className="text-sm text-gray-600">
                     {/* ({reviews.length} {dir === "rtl" ? "تقييم" : "reviews"}) */}
                  </span>
               </div>
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


         {/* Quantity and Actions */}
         <div className="space-y-4">
            <div className="flex items-center space-x-4">
               <Quantity dir={dir} productData={product} />

               <AddToCard productData={product} dir={dir} />
            </div>
               <Button
                  onClick={handleBuyNow}
                  variant="secondary"
                  className="w-full"
                  size="lg"
                  disabled={product.quantityInStock === 0}
               >
                  {dir === "rtl" ? "اشتري الآن" : "Buy Now"}
               </Button>
         </div>
         {/* Shipping Info */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className={cn("flex items-center space-x-3", dir === "rtl" && "space-x-reverse")}>
               <Truck className="h-5 w-5 text-primary" />
               <div>
                  <p className="font-medium text-sm">{dir === "rtl" ? "شحن مجاني" : "Free Shipping"}</p>
                  <p className="text-xs text-gray-600">{dir === "rtl" ? "للطلبات فوق $50" : "On orders over $50"}</p>
               </div>
            </div>
            <div className={cn("flex items-center space-x-3", dir === "rtl" && "space-x-reverse")}>
               <RotateCcw className="h-5 w-5 text-primary" />
               <div>
                  <p className="font-medium text-sm">{dir === "rtl" ? "إرجاع سهل" : "Easy Returns"}</p>
                  <p className="text-xs text-gray-600">{dir === "rtl" ? "خلال 30 يوم" : "Within 30 days"}</p>
               </div>
            </div>
            <div className={cn("flex items-center space-x-3", dir === "rtl" && "space-x-reverse")}>
               <Shield className="h-5 w-5 text-primary" />
               <p className="font-medium text-sm">{dir === "rtl" ? "ضمان الجودة" : "Quality Guarantee"}</p>
               <p className="text-xs text-gray-600">{dir === "rtl" ? "ضمان لمدة سنة" : "1 year warranty"}</p>
            </div>
         </div>
      </div>
   )
}

export default InfoItem