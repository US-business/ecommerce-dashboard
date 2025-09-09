import Link from "next/link"
import Image from "next/image"
import { ProductProps } from "@/types/product"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/shadcnUI/button"
import { Badge } from "@/components/shadcnUI/badge"

interface ProductCardProps {
   product: ProductProps
   dir?: string
}

const ProductCard = ({ product , dir = "ltr" }: ProductCardProps) => {
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





   return (
      <div className="group relative overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md">
         <Link href={`/products/${product.slug}`} className="block">
            <div className="relative h-30 w-full">
               <Image
                  src={product.image || "/placeholder.jpg"}
                  alt={product.nameEn}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
               />
               {product.badge && (
                  <Badge
                     className="absolute left-3 top-3 rounded-full px-3 py-1 text-sm font-semibold"
                     variant="destructive"
                  >
                     {product.badge}
                  </Badge>
               )}
            </div>
         </Link>

         <div className="p-4">
            <h3 className="mb-2 truncate text-lg font-semibold">
               <Link href={`/products/${product.slug}`}>{product.nameEn}</Link>
            </h3>

            <div className="mb-2 flex items-center">
               <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                     <Star
                        key={i}
                        className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                     />
                  ))}
               </div>
               <span className="ml-2 text-sm text-gray-500">(120)</span>
            </div>

            <div className="mb-4 flex items-baseline gap-2">
               <p className="text-xl font-bold text-primary">
                  ${discountedPrice?.toFixed(2)}
               </p>
               {hasDiscount && (
                  <p className="text-sm text-gray-500 line-through">
                     ${product?.price?.toFixed(2)}
                  </p>
               )}
            </div>

            <div className="flex items-center gap-2">
               <Button className="flex-1 gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>{dir === "rtl" ? "أضف إلى السلة" : "Add to Cart"}</span>
               </Button>
               <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
               </Button>
            </div>
         </div>
      </div>
   )
}

export default ProductCard
