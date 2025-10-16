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
import CarouselCategoryProducts from "@/components/ui/Carousel/CarouselCategoryProducts"
import { AppProvider } from "@/components/providers/app-provider"
import { getAllProductsActions } from "@/lib/actions/products"
import { getCategories } from "@/lib/actions/categories"
import CarouselRounded from "@/components/ui/Carousel/CarouselRounded"
import CarouselMain from "@/components/ui/Carousel/mainCarousel/CarouselMain"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { type Locale } from "@/lib/i18n/i18n-config"
import HeroSection from "@/components/ui/HeroSection"
import FeaturesSection from "@/components/ui/FeaturesSection"
import TestimonialsSection from "@/components/ui/TestimonialsSection"
import TrustIndicators from "@/components/ui/TrustIndicators"


export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  // Get products, categories, and featured products from the server
  const [productsRes, categoriesRes, featuredProductsRes] = await Promise.all([
    getAllProductsActions(1, 20), // Get all productsRes
    getCategories(), // Get all categories
    getAllProductsActions(1, 20, undefined, false, undefined, true), // Get featured products
  ])

  const products = productsRes.success && productsRes.data ? productsRes.data : []
  const categories = categoriesRes.success && categoriesRes.data ? categoriesRes.data : []
  const featuredProducts = featuredProductsRes.success && featuredProductsRes.data ? featuredProductsRes.data : []

  return (
    <>
      {/* Background Decorations - Hidden on mobile for better performance */}
      <div className="relative w-full h-full z-0 pointer-events-none hidden xl:block">
        <SunSVG className="absolute top-25 -left-25 z-0 pointer-events-none w-50 h-50 rotate-65 opacity-30 text-emerald-600" />
        <FishSVG className="absolute top-[40dvh] left-15 z-0 pointer-events-none w-20 h-20 rotate-45 opacity-30 text-emerald-600" />
        <StoreSVG className="absolute top-[70dvh] left-2 z-0 pointer-events-none w-30 h-30 rotate-25 opacity-30 text-emerald-600" />
        <LampDeskSVG className="absolute top-[100dvh] left-15 z-0 pointer-events-none w-30 h-30 -rotate-25 opacity-30 text-emerald-600" />
        <SunSVG className="absolute top-[60dvh] -right-25 z-0 pointer-events-none w-50 h-50 rotate-65 opacity-30 text-cyan-600" />
        <GiftSVG className="absolute top-70 right-0 z-0 pointer-events-none w-40 h-40 -rotate-45 opacity-30 text-cyan-600" />
        <CakeSVG className="absolute top-[10dvh] right-2 z-0 pointer-events-none w-20 h-20 rotate-25 opacity-30 text-cyan-600" />
        <GamepadSVG className="absolute top-[90dvh] right-2 z-0 pointer-events-none w-40 h-40 rotate-25 opacity-30 text-cyan-600" />
        <ShirtSVG className="absolute top-[120dvh] right-10 z-0 pointer-events-none w-25 h-25 -rotate-25 opacity-30 text-cyan-600" />
      </div>

      <div className={`${cn('min-h-screen container mx-auto overflow-hidden')}`}>
        {/* Hero Section - New Modern Design */}
        {/* <HeroSection dir={dir} /> */}



        {/* Main Content */}
        <AppProvider initialProducts={products} initialCategories={categories} initialFeaturedProducts={featuredProducts}>
          <div className="flex flex-col lg:flex-row justify-between gap-4 items-start w-full min-h-[40dvh] p-4">
            <div className="w-full lg:w-auto flex-shrink-0">
              <CategoriesList categories={categories} dictionary={dictionary} dir={dir}/>
            </div>
              <CarouselMain items={featuredProducts} dir={dir} lang={lang} className="shadow-md" />
          </div>

          <CarouselRounded items={categories} dir={dir} className="mx-auto" />

          <div className="my-12">
            {categories && categories.length > 0 && categories.map(category => (
              <CarouselCategoryProducts key={category.id} dir={dir} categoryId={category.id} />
            ))
            }
          </div>
        </AppProvider>

        {/* Testimonials Section */}
        <TestimonialsSection dir={dir} />
        {/* Trust Indicators Section */}
        <TrustIndicators dir={dir} />
      </div>
    </>
  )
}