import { ProductProps } from "@/types/product"
import ProductCard from "../../ProductCard/ProductCard"
import { cn } from "@/lib/utils"

interface ProductGridProps {
  products: ProductProps[]
  dir: string
  lang: string
  maxProducts?: number // عدد المنتجات المراد عرضها (اختياري)
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

export const ProductGrid = ({ products, dir, lang, maxProducts, translations }: ProductGridProps) => {
  // حساب نسبة الخصم لكل منتج
  const getDiscountPercentage = (product: ProductProps): number => {
    if (!product.discountValue || product.discountType === 'none') return 0

    if (product.discountType === 'percentage') {
      return product.discountValue
    } else if (product.discountType === 'fixed' && product.price) {
      return (product.discountValue / product.price) * 100
    }

    return 0
  }

  // ترتيب المنتجات حسب نسبة الخصم من الأعلى للأدنى
  const sortedProducts = [...products].sort((a, b) => {
    const discountA = getDiscountPercentage(a)
    const discountB = getDiscountPercentage(b)
    return discountB - discountA
  })

  // تحديد عدد المنتجات المعروضة
  const displayedProducts = maxProducts
    ? sortedProducts.slice(0, maxProducts)
    : sortedProducts

  return (
    <div className={cn(
      "grid gap-4 sm:gap-6",
      "grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
    )}>
      {displayedProducts.map((product) => (
        <div
          key={product.id}
          className={cn("group relative transform transition-all duration-300 hover:scale-105 hover:z-10")}
        >
          {/* Glow effect on hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-75 blur transition-all duration-300" />

          <div className={cn("relative h-[400px]")}>
            <ProductCard
              product={product}
              dir={dir}
              lang={lang}
              hiddenButtonCart={false}
              translations={translations}
              className={cn(
                "h-[400px] shadow-md hover:shadow-2xl",
                "border-2 border-transparent hover:border-amber-400",
                "transition-all duration-300"
              )}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
