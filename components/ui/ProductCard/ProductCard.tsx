"use client"

import Link from "next/link"
import Image from "next/image"
import { ProductProps, ProductStatus } from "@/types/product"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/shadcnUI/button"
import { Badge } from "@/components/shadcnUI/badge"
import { cn } from "@/lib/utils"
import { Card } from "../../shadcnUI/card"
import { useEffect, useState } from "react"
import { getProductReviews } from "@/lib/actions/reviews"
import { useRouter } from "next/navigation"
import { useAuth, useCartStore } from "@/lib/stores"
import { addToCartAction, getCartFull } from "@/lib/actions/cart"
import { useToast } from "@/hooks/use-toast"
import {
   ProductStatusBanner,
   ProductStatusBadge,
   ProductDiscountBadge,
   ProductImage,
   ProductReviews,
   ProductPrice,
   ProductActions
} from './_components'

interface ProductCardProps {
   product: ProductProps
   dir: string
   lang?: string
   hiddenButtonCart?: boolean
   className?: string
   translations?: {
      addToCart?: string
      outOfStock?: string
      reviews?: string
      bestSeller?: string
      new?: string
      comingSoon?: string
      onSale?: string
      addedToCart?: string
      itemsAdded?: string
      error?: string
      failedToAdd?: string
      loginRequired?: string
   }
}

const ProductCard = ({
   product,
   dir,
   lang = 'en',
   hiddenButtonCart = false,
   className,
   translations
}: ProductCardProps) => {
   const [averageRating, setAverageRating] = useState<number>(0)
   const [totalReviews, setTotalReviews] = useState<number>(0)
   const [isLoadingReviews, setIsLoadingReviews] = useState(true)
   const [isAddingToCart, setIsAddingToCart] = useState(false)

   const { user } = useAuth()
   const router = useRouter()
   const { addItem, setItems } = useCartStore()
   const { toast } = useToast()

   // Load reviews from database
   useEffect(() => {
      const loadReviews = async () => {
         if (!product.id) {
            setIsLoadingReviews(false)
            return
         }

         try {
            const response = await getProductReviews(product.id)
            if (response.success) {
               setAverageRating(response.averageRating || 0)
               setTotalReviews(response.totalReviews || 0)
            }
         } catch (error) {
            console.error('Error loading reviews:', error)
         } finally {
            setIsLoadingReviews(false)
         }
      }

      loadReviews()
   }, [product.id])

   const price = Number(product?.price) || 0
   const discountValue = Number(product?.discountValue) || 0

   const hasDiscount: boolean =
      product?.discountType !== "none" && discountValue > 0

   const discountedPrice: number = hasDiscount
      ? price - (product.discountType === "fixed"
         ? discountValue
         : (price * discountValue) / 100)
      : price


   const handleAddToCart = async () => {
      if (!user) {
         router.push(`/${lang}/signin`)
         toast({
            title: translations?.loginRequired || (dir === 'rtl' ? 'يجب تسجيل الدخول' : 'Login Required'),
            description: dir === 'rtl'
               ? 'يرجى تسجيل الدخول لإضافة المنتجات إلى السلة'
               : 'Please login to add items to cart',
            variant: "destructive"
         })
         return
      }

      if (!product?.id) {
         console.warn('Product id is missing')
         return
      }

      setIsAddingToCart(true)
      try {
         const res = await addToCartAction(user.id, product.id, 1)

         if (!res.success) {
            throw new Error(res.error || 'Failed to add to cart')
         }

         // Optimistically update local cart store
         addItem({
            productId: Number(product.id),
            quantity: 1,
            coupon: {
               id: 0,
               code: "",
               discountType: 'none',
               discountValue: "0"
            },
            product: {
               id: Number(product.id),
               nameEn: product.nameEn,
               nameAr: product.nameAr,
               price: String(product.price ?? 0),
               images: product.images ?? [],
               quantityInStock: Number(product.quantityInStock ?? 0),
               discountType: (product.discountType ?? 'none') as 'fixed' | 'percentage' | 'none',
               discountValue: product.discountValue != null ? String(product.discountValue) : null
            }
         })

         // Fetch canonical cart from server
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
            title: translations?.addedToCart || (dir === 'rtl' ? "تمت الإضافة بنجاح" : "Added to Cart"),
            description: translations?.itemsAdded || (dir === 'rtl'
               ? 'تمت إضافة المنتج إلى السلة'
               : 'Item added to your cart'),
            variant: "default"
         })
      } catch (error) {
         console.error('Add to cart error:', error)
         toast({
            title: translations?.error || (dir === 'rtl' ? "خطأ" : "Error"),
            description: translations?.failedToAdd || (dir === 'rtl'
               ? 'فشل في إضافة المنتج إلى السلة'
               : 'Failed to add item to cart'),
            variant: "destructive"
         })
      } finally {
         setIsAddingToCart(false)
      }
   }

   const productName = dir === 'rtl' ? product.nameAr : product.nameEn
   const currencySymbol = dir === 'rtl' ? 'ج.م' : 'EGP'

   return (
      <Card className={cn(
         "group relative w-full h-[350px] overflow-hidden flex flex-col gap-2 p-4 rounded-xl border shadow-sm transition-all hover:shadow-lg hover:border-amber-500/30 select-none",
         className
      )}>
         {/* Out of Stock Banner */}
         <ProductStatusBanner
            isVisible={!product.quantityInStock}
            text={translations?.outOfStock || (dir === 'rtl' ? 'نفذت الكمية' : 'Out of Stock')}
         />

         {/* Status Badge */}
         <ProductStatusBadge
            status={product.status || 'normal'}
            isVisible={product.quantityInStock && product.status && product.status !== 'normal'}
            dir={dir}
            translations={translations}
            product={product}
            hiddenButtonCart={hiddenButtonCart}
            lang={lang}
         />

         {/* Discount Badge */}
         <ProductDiscountBadge
            hasDiscount={product.quantityInStock && hasDiscount}
            discountType={product.discountType || 'none'}
            discountValue={discountValue}
            currencySymbol={currencySymbol}
            dir={dir}
         />

         {/* Product Image */}
         <ProductImage
            productId={Number(product.id)}
            images={product.images}
            imageAlt={product.imageAlt}
            productName={productName}
            lang={lang}
         />

         {/* Product Info */}
         <div className="flex flex-col gap-2 flex-1">
            {/* Product Name */}
            <h3 className="font-semibold text-base line-clamp-2 min-h-[2.5rem] hover:text-amber-600 transition-colors">
               <Link href={`/${lang}/products/${product.id}`}>
                  {productName}
               </Link>
            </h3>

            {/* Reviews */}
            <ProductReviews
               averageRating={averageRating}
               totalReviews={totalReviews}
               isLoading={isLoadingReviews}
            />

            {/* Price */}
            <ProductPrice
               price={price}
               discountedPrice={discountedPrice}
               currencySymbol={currencySymbol}
               hasDiscount={hasDiscount}
               dir={dir}
            />

            {/* Actions */}
            <ProductActions
               isVisible={!hiddenButtonCart && product.quantityInStock > 0}
               isAddingToCart={isAddingToCart}
               onAddToCart={handleAddToCart}
               addToCartText={translations?.addToCart || (dir === 'rtl' ? 'أضف إلى السلة' : 'Add to Cart')}
               addingText={dir === 'rtl' ? 'جاري الإضافة...' : 'Adding...'}
               dir={dir}
               productId={Number(product.id)}
               lang={lang}
            />
         </div>
      </Card>
   )
}

export default ProductCard
