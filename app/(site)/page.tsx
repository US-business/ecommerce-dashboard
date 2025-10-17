import CategoriesList from "@/components/layout/CategoriesList"
import { cn } from "@/lib/utils"
import SunSVG from "@/components/ui/SVG/SunSVG"
import GiftSVG from "@/components/ui/SVG/GiftSVG"
import FishSVG from "@/components/ui/SVG/FishSVG"
import CakeSVG from "@/components/ui/SVG/CakeSVG"
import StoreSVG from "@/components/ui/SVG/StoreSVG"
import GamepadSVG from "@/components/ui/SVG/GamepadSVG"
import LampDeskSVG from "@/components/ui/SVG/LampDeskSVG"
import ShirtSVG from "@/components/ui/SVG/ShirtSVG"
import CarouselCategoryProducts from "@/components/layout/CarouselCategoryProducts"
import { AppProvider } from "@/components/providers/app-provider"
import { getAllProductsActions, searchProductsAction } from "@/lib/actions/products"
import { getCategories } from "@/lib/actions/categories"
import CarouselRounded from "@/components/ui/CarouselRounded"
import { cookies } from "next/headers"
import CarouselMain from "@/components/ui/CarouselMain"

export default async function HomePage() {

  const cookieStore = await cookies();
  const locale = cookieStore.get("preferred-locale")?.value || "ar"; // default ar
  const dir = locale === "ar" ? "rtl" : "ltr";

  // جلب المنتجات والكاتيجوري من السيرفر
  const [productsRes, categoriesRes, featuredProductsRes] = await Promise.all([
    getAllProductsActions(1, 20), // ممكن تختار المنتجات المميزة
    getCategories(),
    getAllProductsActions(1, 20, undefined, false, undefined, true),
  ])

  const products = productsRes.success ? productsRes.data : []
  const categories = categoriesRes.success ? categoriesRes.data : []
  const featuredProducts = featuredProductsRes.success ? featuredProductsRes.data : []





  return (
    <>
      <div className="relative w-full h-full z-0 pointer-events-none">
        <SunSVG className="hidden lg:block absolute top-25 -left-25 z-0 pointer-events-none w-50 h-50 rotate-65 opacity-30 text-emerald-600" />
        <FishSVG className="hidden lg:block absolute top-[40dvh] left-15 z-0 pointer-events-none w-20 h-20 rotate-45 opacity-30 text-emerald-600" />
        <StoreSVG className="hidden lg:block absolute top-[70dvh] left-2 z-0 pointer-events-none w-30 h-30 rotate-25 opacity-30 text-emerald-600" />
        <LampDeskSVG className="hidden lg:block absolute top-[100dvh] left-15 z-0 pointer-events-none w-30 h-30 -rotate-25 opacity-30 text-emerald-600" />
        <SunSVG className="hidden lg:block absolute top-[60dvh] -right-25 z-0 pointer-events-none w-50 h-50 rotate-65 opacity-30 text-cyan-600" />
        <GiftSVG className="hidden lg:block absolute top-70 right-0 z-0 pointer-events-none w-40 h-40 -rotate-45 opacity-30 text-cyan-600" />
        <CakeSVG className="hidden lg:block absolute top-[10dvh] right-2 z-0 pointer-events-none w-20 h-20 rotate-25 opacity-30 text-cyan-600" />
        <GamepadSVG className="hidden lg:block absolute top-[90dvh] right-2 z-0 pointer-events-none w-40 h-40 rotate-25 opacity-30 text-cyan-600" />
        <ShirtSVG className="hidden lg:block absolute top-[120dvh] right-10 z-0 pointer-events-none w-25 h-25 -rotate-25 opacity-30 text-cyan-600" />
      </div>

      <div className={`${cn('min-h-screen container mx-auto overflow-hidden')}`}>
        <AppProvider initialProducts={products} initialCategories={categories} initialFeaturedProducts={featuredProducts}>
          <div className="flex justify-between gap-4 items-center w-full h-[40dvh]  py-4 ">
            <CategoriesList />
            <CarouselMain items={featuredProducts} dir={dir} className="shadow-md" />
          </div>
          <CarouselRounded items={categories} dir={dir} className="mx-auto" />

          <div className="my-12">
            {categories && categories.length > 0 && categories.map(category => (
              <CarouselCategoryProducts key={category.id} dir={dir} categoryId={category.id} />
            ))
            }
          </div>

        </AppProvider>
      </div>
    </>
  )
}
