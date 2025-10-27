import CarouselComponent from "./CarouselComponent"
import type { ProductProps } from "@/types/product"

interface CategoryProductSliderProps {
  products: ProductProps[]
  dir: string
  lang: string
}

const CarouselCategoryProducts = ({ products, dir, lang }: CategoryProductSliderProps) => {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <CarouselComponent dir={dir} items={products} lang={lang} />
  )
}

export default CarouselCategoryProducts
