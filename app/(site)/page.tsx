
import CategoriesList from "@/components/ui/CategoriesList"
import { cn } from "@/lib/utils"
import SunSVG from "@/components/ui/SVG/SunSVG"
import GiftSVG from "@/components/ui/SVG/GiftSVG"
import FishSVG from "@/components/ui/SVG/FishSVG"
import CakeSVG from "@/components/ui/SVG/CakeSVG"
import StoreSVG from "@/components/ui/SVG/StoreSVG"
import GamepadSVG from "@/components/ui/SVG/GamepadSVG"
import LampDeskSVG from "@/components/ui/SVG/LampDeskSVG"
import ShirtSVG from "@/components/ui/SVG/ShirtSVG"
import CategoriesSlider from "@/components/layout/CategoriesSlider"
import FeaturedProductsSlider from "@/components/layout/FeaturedProductsSlider"
import CategoryProductSlider from "@/components/layout/CategoryProductSlider"

export default function HomePage() {




  return (
    <>
      <main className={cn("w-full overflow-hidden relative")}>
        <SunSVG className="hidden lg:block absolute top-25 -left-25 z-0 pointer-events-none w-50 h-50 rotate-65 opacity-30 text-emerald-600" />
        <FishSVG className="hidden lg:block absolute top-[40dvh] left-15 z-0 pointer-events-none w-20 h-20 rotate-45 opacity-30 text-emerald-600" />
        <StoreSVG className="hidden lg:block absolute top-[70dvh] left-2 z-0 pointer-events-none w-30 h-30 rotate-25 opacity-30 text-emerald-600" />
        <LampDeskSVG className="hidden lg:block absolute top-[100dvh] left-15 z-0 pointer-events-none w-30 h-30 -rotate-25 opacity-30 text-emerald-600" />
        <SunSVG className="hidden lg:block absolute top-[60dvh] -right-25 z-0 pointer-events-none w-50 h-50 rotate-65 opacity-30 text-cyan-600" />
        <GiftSVG className="hidden lg:block absolute top-70 right-0 z-0 pointer-events-none w-40 h-40 -rotate-45 opacity-30 text-cyan-600" />
        <CakeSVG className="hidden lg:block absolute top-[10dvh] right-2 z-0 pointer-events-none w-20 h-20 rotate-25 opacity-30 text-cyan-600" />
        <GamepadSVG className="hidden lg:block absolute top-[90dvh] right-2 z-0 pointer-events-none w-40 h-40 rotate-25 opacity-30 text-cyan-600" />
        <ShirtSVG className="hidden lg:block absolute top-[120dvh] right-10 z-0 pointer-events-none w-25 h-25 -rotate-25 opacity-30 text-cyan-600"/>
        <div className={`${cn('min-h-screen container mx-auto h-[3200px]')}`}>
          {/* <TreePalmSVG className="absolute top-1/2 -left-10 z-0 pointer-events-none w-50 h-50 rotate-65 opacity-30"/> */}
          <div className="flex justify-between gap-4 items-center w-full h-[40dvh]  py-4 ">
            <CategoriesList />
            <FeaturedProductsSlider />
          </div>
          <CategoriesSlider />

          <div className="my-12">
            <CategoryProductSlider title="Electronics" categoryId={1} />
          </div>
          <div className="my-12">
            <CategoryProductSlider title="Home & Kitchen" categoryId={2} />
          </div>
        </div>
      </main>
    </>
  )
}
