import Link from "next/link"
import Image from "next/image"
import { ProductProps, ProductStatus } from "@/types/product"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/shadcnUI/button"
import { Badge } from "@/components/shadcnUI/badge"
import { cn } from "@/lib/utils"
import { Card } from "../shadcnUI/card"

interface ProductCardProps {
   product: ProductProps
   dir: string
   hiddenButtonCart?: boolean
   className?: string
}

const ProductCard = ({ product, dir, hiddenButtonCart = false, className }: ProductCardProps) => {
   // const hasDiscount  = product?.discountType !== 'none' && product?.discountValue && product?.discountValue > 0 as boolean

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
            return 'bg-yellow-600/10';
         case 'new':
            return 'bg-green-600/10';
         case 'coming_soon':
            return 'bg-purple-600/10';
         case 'on_sale':
            return 'bg-rose-600/10';
         default:
            return 'bg-gray-600';
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


   return (
      <Card className={cn(`group relative w-full h-full overflow-hidden flex flex-col gap-0 justify-end rounded-lg border shadow-sm transition-all hover:shadow-md select-none ${className}`)}>
         {!product.quantityInStock && (
            <div
               className={cn(
                  `absolute top-[15%] md:top-[8%] left-[-35%] w-[100%] py-[1%] text-center font-bold`,
                  `bg-red-600/50 text-white transform -rotate-45 origin-center`,
                  `shadow-lg z-20 sm:text-sm md:text-sm lg:text-xs`
               )}
            >
               {dir === 'rtl' ? 'نفذت الكمية' : 'Out of Stock'}
            </div>
         )}
         {product.quantityInStock && product.status && product.status !== 'normal' ? (
            <Badge
               className={cn(`absolute top-2`, `${dir === 'rtl' ? 'left-2 text-md' : 'right-2'}`, `${getStatusColor(product.status)}`, `capitalize  text-black`)}
            >
               {getStatusText(product.status)}
            </Badge>
         ) : null}
         <div className={cn("absolute top-2 flex flex-col gap-2", `${dir === 'rtl' ? 'right-2  items-end' : 'left-2'}`)}>
            {product.quantityInStock && hiddenButtonCart ? (
               <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
               </Button>
            ) : null}

            {product.quantityInStock && hasDiscount ? (
               <Badge className={cn("text-md font-bold bg-transparent text-amber-600")} >
                  -{discountValue}%
               </Badge>
            ) : null}
         </div>
         <Link href={`/product/${product.id}`} className="relative flex p-4">
            {/* Status Badge */}
            <div className="relative h-30 w-full">
               <Image
                  src={product?.images?.[0] || "/placeholder.jpg"}
                  alt={product.nameEn}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
               />
            </div>
         </Link> 

         <div className="space-y-2">
            <h3 className="mb-2 truncate text-lg font-semibold">
               <Link href={`/category/${product.slug}`}>{product.nameEn}</Link>
            </h3>

            <div className="mb-2 flex items-center">
               <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                     <Star
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                     />
                  ))}
               </div>
               <span className="ml-2 text-sm text-gray-500">(120)</span>
            </div>

            <div className="mb-4 flex flex-col items-baseline gap-2 w-full">
               {hasDiscount ? (<>
                  <p className="text-xl font-bold text-primary w-full">
                     <span className="text-2xl font-bold text-primary">
                        <span className="text-sm text-gray-500">LE </span>
                        {discountedPrice?.toFixed(2)}
                     </span>
                     <span className="text-sm text-gray-500 line-through block">
                        <span className="text-sm text-gray-500">LE </span>
                        {price?.toFixed(2)}
                     </span>
                  </p>
               </>) : (<>
                  <p className="text-xl font-bold text-primary w-full">
                     <span className="text-sm text-gray-500">LE </span>
                     {price?.toFixed(2)}
                  </p>
               </>
               )}
            </div>
            {!hiddenButtonCart && (
               <div className="flex items-center gap-2">
                  <Button className="flex-1 gap-2 bg-amber-600/10 text-amber-950 hover:bg-amber-600/20 border border-amber-600/20">
                     {dir === "rtl" ? <>
                        <ShoppingCart className="h-5 w-5 font-bold" />
                        <span className={cn("text-md font-bold text-amber-900")}>أضف إلى السلة</span>
                     </> : <>
                        <ShoppingCart className="h-5 w-5" />
                        <span className="text-sm">Add to Cart</span>
                     </>}
                  </Button>
                  <Button variant="outline" size="icon">
                     <Heart className="h-4 w-4" />
                  </Button>
               </div>
            )}
         </div>
      </Card>
   )
}

export default ProductCard
