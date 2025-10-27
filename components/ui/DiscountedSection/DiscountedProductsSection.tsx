"use client"

import { ProductProps } from "@/types/product"
import { cn } from "@/lib/utils"
import { 
  BackgroundDecorations, 
  SectionHeader, 
  ProductGrid, 
  ViewAllButton, 
  BottomWave 
} from "./_components"

interface DiscountedProductsSectionProps {
  products: ProductProps[]
  dir: string
  lang: string
  maxProducts?: number // عدد المنتجات المراد عرضها
  translations?: {
    title?: string
    subtitle?: string
    viewAll?: string
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

const DiscountedProductsSection = ({
  products,
  dir,
  lang,
  maxProducts,
  translations
}: DiscountedProductsSectionProps) => {
  
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className={cn(
      "relative w-full py-12 px-2 sm:px-4 md:px-6",
      // "bg-gradient-to-br from-amber-50/50 via-white to-teal-50/30"
    )}>
      {/* <BackgroundDecorations /> */}

      <div className="relative z-10 container mx-auto">
        <SectionHeader dir={dir} translations={translations} />
        <ProductGrid products={products} dir={dir} lang={lang} maxProducts={maxProducts} translations={translations} />
        {products.length > 0 && (
          <ViewAllButton lang={lang} dir={dir} translations={translations} />
        )}
      </div>

      {/* <BottomWave /> */}
    </section>
  )
}

export default DiscountedProductsSection
