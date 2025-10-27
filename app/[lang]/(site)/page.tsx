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
import { getAllProductsActions, getDiscountedProductsActions } from "@/lib/actions/products"
import { getCategories } from "@/lib/actions/categories"
import CarouselRounded from "@/components/ui/Carousel/CarouselRounded"
import CarouselMain from "@/components/ui/Carousel/mainCarousel/CarouselMain"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { type Locale } from "@/lib/i18n/i18n-config"
import HeroSection from "@/components/ui/HeroSection"
import FeaturesSection from "@/components/ui/FeaturesSection"
import TestimonialsSection from "@/components/ui/TestimonialsSection"
import TrustIndicators from "@/components/ui/TrustIndicators"
import HeroCarousel from "@/components/ui/hero-carousel"
import HeroTitle from "@/components/ui/hero-title"
import CategoriesGrid from "@/components/layout/CategoriesGrid/CategoriesGrid"
import DiscountedProductsSection from "@/components/ui/DiscountedSection/DiscountedProductsSection"


export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  // Parallel data fetching for optimal performance
  const [productsRes, categoriesRes, featuredProductsRes, discountedProductsRes] = await Promise.all([
    getAllProductsActions(1, 20), // All products
    getCategories(), // All categories
    getAllProductsActions(1, 10, undefined, false, undefined, true), // Featured products only
    getDiscountedProductsActions(1, 10), // Discounted products only
  ])

  // Error handling - redirect or show error if critical data fails
  if (!categoriesRes.success || !categoriesRes.data || categoriesRes.data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {dir === 'rtl' ? 'عذراً، حدث خطأ' : 'Sorry, an error occurred'}
          </h1>
          <p className="text-gray-600">
            {dir === 'rtl' ? 'لم نتمكن من تحميل البيانات. يرجى المحاولة مرة أخرى.' : 'Could not load data. Please try again.'}
          </p>
        </div>
      </div>
    )
  }

  const products = productsRes.data || []
  const categories = categoriesRes.data
  const featuredProducts = featuredProductsRes.data || []
  const discountedProducts = discountedProductsRes.data || []

  // ✅ Fix N+1 Problem: Fetch all category products in parallel
  const categoryProductsPromises = categories.map(category =>
    getAllProductsActions(1, 10, undefined, false, category.id)
  )
  const categoryProductsData = await Promise.all(categoryProductsPromises)

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

      {/* Hero Carousel - Full Width */}

      <div className={`${cn('relative pt-25 min-h-screen container mx-auto overflow-hidden rounded-xl')}`}>
        {/* Hero Section - New Modern Design */}
        {/* <HeroSection dir={dir} /> */}
        {/* 
        <div className={cn("bg-[linear-gradient(rgba(0,31,63,0.2)_0%,rgba(0,31,63,0.3)_100%)]",
          "relative w-full flex justify-between flex-col-reverse lg:flex-row",
          "p-6",
        )}> */}
        {/* <div className="absolute inset-0 w-full h-full flex bg-[linear-gradient(180deg,transparent,transparent_5%,transparent_55%,white,#f1f5f8)]  z-0"></div> */}

        <HeroCarousel />
        <HeroTitle title={dictionary.cms.home.hero.title} subtitle={dictionary.cms.home.hero.description} />

        {/* <CategoriesList categories={categories} dictionary={dictionary} dir={dir} lang={lang} className={cn("relative min-w-[15%]")} /> */}
        <div className="relative flex flex-col lg:flex-row justify-between gap-3 sm:gap-4 md:gap-6 items-stretch w-full px-2 sm:px-4 md:px-6">
          <div className="w-full lg:w-auto lg:min-w-[280px] xl:min-w-[320px] flex-shrink-0">
            <CategoriesGrid categories={categories} dictionary={dictionary} dir={dir} lang={lang} maxCategories={4} columns={2} className="relative h-full" />
          </div>
            <CarouselMain items={featuredProducts} dir={dir} lang={lang}  />
        </div>

        {/* </div> */}



        <CarouselRounded items={categories} dir={dir} lang={lang} className="mx-auto" />

        {/* Discounted Products Section */}
        {discountedProducts.length > 0 && (
          <DiscountedProductsSection
            products={discountedProducts}
            dir={dir}
            lang={lang}
            maxProducts={5}
            translations={{
              title: dictionary.cms.home.discountedProducts.title,
              subtitle: dictionary.cms.home.discountedProducts.subtitle,
              viewAll: dictionary.cms.home.discountedProducts.viewAll,
              addToCart: dictionary.cart.addToCart,
              outOfStock: dictionary.cart.outOfStock,
              reviews: dictionary.common.results,
              bestSeller: dictionary.products.statusBestSeller,
              new: dictionary.products.statusNew,
              comingSoon: dictionary.products.statusComingSoon,
              onSale: dictionary.products.statusOnSale,
              addedToCart: dictionary.notifications.success.saved,
              itemsAdded: dictionary.cart.items,
              error: dictionary.common.error,
              failedToAdd: dictionary.errors.generic,
              loginRequired: dictionary.cart.loginRequired
            }}
          />
        )}

        {/* Category Products Section - Fixed N+1 Problem */}
        <div className="my-12 space-y-8">
          {categories.map((category, index) => {
            const products = categoryProductsData[index]?.data || [];

            // Skip if no products in this category
            if (products.length === 0) return null;

            return (
              <div key={category.id} className="space-y-4">

                <CarouselCategoryProducts
                  products={products}
                  dir={dir}
                  lang={lang}
                />
              </div>
            );
          })}
        </div>

        {/* Testimonials Section */}
        <TestimonialsSection dir={dir} />
        {/* Trust Indicators Section */}
        <TrustIndicators dir={dir} />
      </div>
    </>
  )
}