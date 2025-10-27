"use client";
import React, { useContext, useState } from 'react'
import { ProductProps } from "@/types/product"
import { useRouter } from 'next/navigation';
import { useAppStore, useAuth, useCartStore, useCouponsStore } from '@/lib/stores';
import { addToCartAction, getCartFull } from '@/lib/actions/cart';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type ProductControlsProps = {
   dir: string;
   productData: ProductProps;
   lang?: string;
}

const AddToCard = ({ productData, dir, lang = 'ar' }: ProductControlsProps) => {
   const { user } = useAuth();
   const router = useRouter();
   const { addItem, setItems, setQuantityToCart, quantityToCart } = useCartStore();
   const { toast } = useToast();
   const availableStock = Number(productData.quantityInStock ?? 0)





   const handleAddToCart = async () => {
      if (!user) {
         router.push(`/${lang}/signin`);
         return;
      } else {
         if (!productData?.id) {
            console.warn('Product id is missing');
            return;
         }
         try {
            if (!productData.id) {
               throw new Error('Product ID is required');
            }


            const res = await addToCartAction(user.id, productData.id, quantityToCart);
            
            // Optimistically update local cart store for immediate UI feedback
            addItem({
               productId: Number(productData.id),
               quantity: Number(quantityToCart),
               coupon: {
                  id: 0,
                  code: "",
                  discountType: 'none',
                  discountValue: "0"
               },
               product: {
                  id: Number(productData.id),
                  nameEn: productData.nameEn,
                  nameAr: productData.nameAr,
                  price: String(productData.price ?? 0),
                  images: productData.images ?? [],
                  quantityInStock: Number(productData.quantityInStock ?? 0),
                  discountType: (productData.discountType ?? 'none') as 'fixed' | 'percentage' | 'none',
                  discountValue: productData.discountValue != null ? String(productData.discountValue) : null
               }
            })
            // Fetch canonical cart from server and sync local store
            const full = await getCartFull(user.id)

            if (full?.success && full?.data && Array.isArray(full?.data?.items)) {
               const serverItems = full.data.items.map((item: any) => ({
                  id: item.id,
                  productId: item.productId,
                  quantity: item.quantity,
                  product: {
                     id: item.product.id,
                     nameEn: item.product.nameEn,
                     nameAr: item.product.nameAr,
                     price: String(item.product.price ?? 0),
                     images: item.product.images ?? [],
                     quantityInStock: Number(item.product.quantityInStock ?? 0),
                     discountType: item.product.discountType,
                     discountValue: item.product.discountValue != null ? String(item.product.discountValue) : null,
                  }
               }))
               setItems(serverItems)
            }
            toast({
               title: dir === 'rtl' ? "تمت الإضافة بنجاح" : "Added to Cart",
               description: dir === 'rtl'
                  ? `تمت إضافة ${quantityToCart} من المنتج إلى السلة`
                  : `${quantityToCart} item(s) added to your cart`,
               variant: "default"
            });
            // Reset quantity to 1 after adding
            setQuantityToCart(1);
         } catch (error) {
            console.log(error);
            toast({
               title: dir === 'rtl' ? "خطأ" : "Error",
               description: dir === 'rtl'
                  ? 'فشل في إضافة المنتج إلى السلة'
                  : 'Failed to add item to cart',
               variant: "destructive"
            });
         }
      }
   };



   return availableStock > 0 ? (
      <>
         <button type='button'
            title={dir === 'rtl' ? "أضف إلى السلة" : "Add to Cart"}
            className={cn("min-h-9 sm:min-h-10 w-full bg-amber-600/10 text-amber-950 hover:bg-amber-600/20 border border-amber-600/20 text-sm sm:text-base rounded-lg font-normal cursor-pointer hover:border-2 hover:border-color-frontground-700 transition duration-200 flex items-center justify-center gap-2 sm:gap-3 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed px-3")}
            onClick={handleAddToCart}
            disabled={availableStock <= 0}
         >
            {dir === 'rtl' ?
               (<>
                  <span className='flex items-center truncate'>أضف إلى السلة</span>
                  {quantityToCart > 1 ? (<span className='flex items-center flex-shrink-0'> {`( ${quantityToCart} )`}</span>) : null}
                  <span className='flex items-center flex-shrink-0'>
                     <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
               </>)
               :
               (<>
                  <span className='flex items-center flex-shrink-0'>
                     <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  {quantityToCart > 1 ? (<span className='flex items-center flex-shrink-0'> {`( ${quantityToCart} )`}</span>) : null}
                  <span className='flex items-center truncate'>Add to Cart</span>
               </>)
            }
         </button>
      </>
   ) : null;
}

export default AddToCard