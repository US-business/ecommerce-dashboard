<div className="flex justify-center mt-8" >
    {/* Numbered Pagination with ellipses */ }
    < Pagination >
    <PaginationContent>
    {/* Previous */ }
    < PaginationItem >
    <PaginationPrevious
                                            href="#"
aria - disabled={ page === 1 }
className = { page === 1 ? "pointer-events-none opacity-50" : ""}
onClick = {(e) => {
    e.preventDefault();
    if (page === 1) return;
    setPage(page - 1);
    window.scroll({ top: 0, behavior: "smooth" });
}}
                                        />
    </>

{/* Page numbers */ }
{
    (() => {
        const items: (number | "ellipsis")[] = []
        const maxToShow = 5 // window size around current
        const add = (v: number | "ellipsis") => items.push(v)
        const first = 1
        const last = totalPages
        const start = Math.max(first, page - 2)
        const end = Math.min(last, page + 2)

        // Always show first
        add(first)
        if (start > first + 1) add("ellipsis")

        for (let p = start; p <= end; p++) {
            if (p !== first && p !== last) add(p)
        }

        if (end < last - 1) add("ellipsis")
        if (last > first) add(last)

        return items.map((it, idx) => (
            it === "ellipsis" ? (
                <PaginationItem key= {`el-${idx}`}>
    <PaginationEllipsis />
    </PaginationItem>
                                            ) : (
        <PaginationItem key= { it } >
        <PaginationLink
                                                        href="#"
    isActive = { page === it
}
onClick = {(e) => {
    e.preventDefault();
    if (page === it) return;
    setPage(it)
    window.scroll({ top: 0, behavior: "smooth" })
}}
                                                    >
    { it }
    </PaginationLink>
    </PaginationItem>
                                            )
                                        ))
                                    }) ()}

{/* Next */ }
<PaginationItem>
    <PaginationNext
                                            href="#"
aria - disabled={ page >= totalPages }
className = { page >= totalPages ? "pointer-events-none opacity-50" : ""}
onClick = {(e) => {
    e.preventDefault();
    if (page >= totalPages) return;
    setPage(page + 1);
    window.scroll({ top: 0, behavior: "smooth" });
}}
                                        />
    </PaginationItem>
    </PaginationContent>
    </Pagination>
    </div>











    <!-- ///////////////////////////////////////////// --> image

        <Image src={product.image} fill sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' alt={product.nameEn} className="object-contain" />

       <div className="absolute inset-0 bg-linear-to-r from-gray-50 via-30% via-black/60  to-60% to-gray-50 z-0" /> 





















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
}

const CategoryProductSlider = async ({ title, categoryId}: CategoryProductSliderProps) => {
  const { data: products } = await getAllProductsActions(1, 10, undefined, false, categoryId)
  console.log(products)
  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="w-full py-8 overflow-visible relative">
      <h2 className="mb-6 text-3xl font-bold">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: true
        }}
        className="w-full"
      >
        <CarouselContent>
          {products?.map((product: any) => (
            <CarouselItem key={product.id} className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <div className="p-1">
                <ProductCard product={product as ProductProps}/>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-[-1rem] top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100" />
        <CarouselNext className="absolute right-[-1rem] top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100" />
      </Carousel>
    </div>
  )
}

export default CategoryProductSlider



أرغب في إنشاء صفحة حساب متكاملة وسهلة الاستخدام للمستخدم، لكن يجب أولاً مراجعة مجلدات المشروع والملفات للتأكد من كل شيء مثل السكيمات، الستور، الترجمة، وغيرها. أحتاج أن تكون الصفحة الرئيسية بمثابة سيرفر لجلب البيانات وتمريرها إلى باقي المكونات أو الصفحات. إذا كانت موجودة، يمكنك استخدام مكتبة shadcn الموجودة في المشروع.