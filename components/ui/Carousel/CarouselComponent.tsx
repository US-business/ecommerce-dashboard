import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/shadcnUI/carousel"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/shadcnUI/button"
import { Badge } from "@/components/shadcnUI/badge"
import { Card, CardHeader, CardTitle } from "../../shadcnUI/card"
import { cn } from "@/lib/utils"
import ProductCard from "../ProductCard"
interface CategoryProductSliderProps {
  items: any[] | undefined;
  dir: string;
  className?: string;
}

const CarouselComponent = ({ dir = 'ltr', items, className }: CategoryProductSliderProps) => {


  if (!items || items.length === 0) {
    return null
  }

  return (
    <Card className={className ? className : `mt-6 overflow-visible relative bg-transparent gap-2 border-0 ${className}`}>
      <CardHeader className="text-md font-bold flex items-center justify-between w-full bg-white p-1 px-3 rounded-md shadow-md">
        <CardTitle>
          {dir === "rtl" ? items[0].category.nameAr : items[0].category.nameEn}
        </CardTitle>
        <Link
          href={`/category/${items[0].category.slug}`}
          className="text-sm text-amber-600 hover:text-amber-700 px-3 py-1 rounded-md transition-2"
        >
          {dir === "rtl" ? "عرض الكل" : "View All"}
        </Link>
      </CardHeader>
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true,
          direction: dir === "rtl" ? "rtl" : "ltr",
        }}
        
      >
        <CarouselContent >
          {items?.map((item: any) => (
            <CarouselItem key={item.id} className="basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 p-3">
              <ProductCard product={item} dir={dir} hiddenButtonCart className="shadow-md" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex absolute left-[-1rem] top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100" />
        <CarouselNext className="hidden md:flex absolute right-[-1rem] top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100" />
      </Carousel>
    </Card>
  )
}

export default CarouselComponent





// //////////////////////////////////////////////// 





const ItemCard = ({ item }: { item: any }) => {
  // const hasDiscount  = product?.discountType !== 'none' && product?.discountValue && product?.discountValue > 0 as boolean

  const price = Number(item?.price) || 0;
  const discountValue = Number(item?.discountValue) || 0;

  const hasDiscount: boolean =
    item?.discountType !== "none" && discountValue > 0;

  const discountedPrice: number = hasDiscount
    ? price - (item.discountType === "fixed"
      ? discountValue
      : (price * discountValue) / 100)
    : price;

  return (
    <Card className="group relative w-full h-full flex flex-col justify-between overflow-hidden rounded-lg border transition-all hover:shadow-md select-none">
      <Link href={`/products/${item.slug}`} className="relative flex h-30 w-full ">
        <Image
          src={item.image || "/placeholder.jpg"}
          alt={item.nameEn}
          fill
          className="object-contain h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="relative w-full flex flex-col  gap-1">
        <h3 className="truncate text-lg font-semibold">
          <Link href={`/products/${item.slug}`}>{item.nameEn}</Link>
        </h3>

        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">(120)</span>
        </div>

        <div className=" flex flex-col items-baseline">
          <p className="text-xl font-bold text-primary">
            <span className="text-sm text-gray-500">LE </span>
            {discountedPrice?.toFixed(2)}
          </p>
          {hasDiscount && (
            <p className="text-sm text-gray-500 line-through">
              LE {price?.toFixed(2)}
            </p>
          )}
        </div>

      </div>
      <div className={cn(`absolute left-2 top-2 flex flex-col items-end gap-2`)}>
        {hasDiscount && (
          <Badge className="rounded-md px-3 py-1 text-sm font-semibold bg-amber-200/50 text-amber-600">
            -{discountValue}%
          </Badge>
        )}
          <Button variant="outline" size="icon" className="bg-amber-200/50 text-amber-500 border-0 hover:bg-amber-200/70 hover:text-amber-600">
            <Heart className="h-4 w-4" />
          </Button>
      </div>
      {item.status && (
        <Badge className="absolute right-2 top-2 rounded-md px-3 py-1 text-sm font-semibold bg-green-200/50 text-green-600">
          {item.status}
        </Badge>
      )}
    </Card>
  )
}

