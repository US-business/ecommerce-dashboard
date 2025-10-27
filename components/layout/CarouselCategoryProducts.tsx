
import { getAllProductsActions } from "@/lib/actions/products"
import CarouselComponent from "../ui/Carousel/CarouselComponent"

interface CategoryProductSliderProps {
  categoryId: number
  dir: string
}

const CarouselCategoryProducts = async ({categoryId , dir }: CategoryProductSliderProps) => {
  const { data: products } = await getAllProductsActions(1, 10, undefined, false, categoryId)


  if (!products || products.length === 0) {
    return null
  }

  return (
    <CarouselComponent  dir={dir} items={products} />
  )
}

export default CarouselCategoryProducts
