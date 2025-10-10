'use client';

import { Badge } from '@/components/shadcnUI/badge';
import { Card } from '@/components/shadcnUI/card';
import { useCookies } from 'next-client-cookies';
import { ProductProps , ProductStatus } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
   product: {
      id: number;
      nameEn: string;
      nameAr: string;
      image: string;
      price: number;
      status: ProductStatus;
      discountType: 'fixed' | 'percentage' | 'none';
      discountValue?: number;
      badge?: string;
      badgeAr?: string;
   };
}

export const ProductCard = ({ product }: ProductCardProps) => {
   const cookies = useCookies();
   const locale = cookies.get('preferred-locale') || 'ar';
   const dir = locale === 'ar' ? 'rtl' : 'ltr';


      const price = Number(product?.price) || 0;
   const discountValue = Number(product?.discountValue) || 0;

   const hasDiscount: boolean =
      product?.discountType !== "none" && discountValue > 0;

   const discountedPrice: number = hasDiscount
      ? price - (product.discountType === "fixed"
         ? discountValue
         : (price * discountValue) / 100)
      : price;

   const getStatusColor = (status: ProductStatus) => {
      switch (status) {
         case 'best_seller':
            return 'bg-yellow-500';
         case 'new':
            return 'bg-green-500';
         case 'coming_soon':
            return 'bg-purple-500';
         case 'on_sale':
            return 'bg-blue-500';
         default:
            return 'bg-gray-500';
      }
   };

   const getStatusText = (status: ProductStatus) => {
      if (dir === 'rtl') {
         switch (status) {
            case 'best_seller':
               return 'الأكثر مبيعاً';
            case 'new':
               return 'جديد';
            case 'coming_soon':
               return 'قريباً';
            case 'on_sale':
               return 'تخفيض';
            default:
               return '';
         }
      }

      return status.replace('_', ' ').toUpperCase();
   };

   const calculateDiscountedPrice = () => {
      if (!product.discountValue || product.discountType === 'none') return price;

      if (product.discountType === 'percentage') {
         return price - (price * discountValue / 100);
      }
      
      return price - discountValue;
   };

   return (
      <Link href={`/product/${product.id}`}>
         <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden">
               <Image
                  src={product.image}
                  alt={dir === 'rtl' ? product.nameAr : product.nameEn}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
               />

               {/* Status Badge */}
               {product.status && product.status !== 'normal' && (
                  <Badge
                     className={`absolute top-2 ${dir === 'rtl' ? 'right-2' : 'left-2'} ${getStatusColor(product.status)} text-white`}
                  >
                     {getStatusText(product.status)}
                  </Badge>
               )}

               {/* Custom Badge */}
               {((dir === 'rtl' && product.badgeAr) || (dir === 'ltr' && product.badge)) && (
                  <Badge
                     className="absolute top-2 right-2 bg-primary text-white"
                  >
                     {dir === 'rtl' ? product.badgeAr : product.badge}
                  </Badge>
               )}
            </div>

            {/* Product Info */}
            <div className="p-4">
               <h3 className="font-medium mb-2 line-clamp-2">
                  {dir === 'rtl' ? product.nameAr : product.nameEn}
               </h3>

               <div className="flex items-center justify-between">
                  <div>
                     {product.discountType !== 'none' && product.discountValue ? (
                        <div className="space-x-2 rtl:space-x-reverse">
                           <span className="text-lg font-bold text-primary">
                              {calculateDiscountedPrice().toFixed(2)} {dir === 'rtl' ? 'جنيه' : 'EGP'}
                           </span>
                           <span className="text-sm text-muted-foreground line-through">
                              {price.toFixed(2)} {dir === 'rtl' ? 'جنيه' : 'EGP'}
                           </span>
                        </div> 
                     ) : (
                        <span className="text-lg font-bold text-primary">
                           {price.toFixed(2)} {dir === 'rtl' ? 'جنيه' : 'EGP'}
                        </span>
                     )}
                  </div>
               </div>
            </div>
         </Card>
      </Link>
   );
};