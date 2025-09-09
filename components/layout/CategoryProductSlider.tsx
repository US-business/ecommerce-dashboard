import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/shadcnUI/carousel"
import { getAllProductsActions } from "@/lib/actions/products"
import ProductCard from "../ui/ProductCard"
import { ProductProps } from "@/types/product"

interface CategoryProductSliderProps {
  title: string
  categoryId: number
  dir?: string
}

const CategoryProductSlider = async ({ title, categoryId , dir = "ltr" }: CategoryProductSliderProps) => {
  const { data: products } = await getAllProductsActions(1, 10, undefined, false, categoryId)

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="w-full py-8">
      <h2 className="mb-6 text-3xl font-bold">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {products.map((product: any) => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <div className="p-1">
                <ProductCard product={product as ProductProps} dir={dir} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-[-1rem] top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-[-1rem] top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>
  )
}

export default CategoryProductSlider
