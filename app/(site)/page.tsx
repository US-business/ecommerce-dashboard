"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Button } from "@/components/shadcnUI/button"
import { LanguageToggle } from "@/components/language-toggle"
import { Package } from "lucide-react"
import LoadingPage from "@/components/layout/Loading-page"
import { useAppStore } from "@/lib/stores/app-store"
import Slider from "@/components/ui/Slider"
import SliderRounded from "@/components/ui/SliderRounded"
import CategoriesList from "@/components/ui/CategoriesList"
import { cn } from "@/lib/utils"
import TreePalmSVG from "@/components/ui/SVG/TreePalmSVG"
import SunSVG from "@/components/ui/SVG/SunSVG"
import GiftSVG from "@/components/ui/SVG/GiftSVG"
import FishSVG from "@/components/ui/SVG/FishSVG"
import CakeSVG from "@/components/ui/SVG/CakeSVG"
import StoreSVG from "@/components/ui/SVG/StoreSVG"
import GamepadSVG from "@/components/ui/SVG/GamepadSVG"
import LampDeskSVG from "@/components/ui/SVG/LampDeskSVG"
import ShirtSVG from "@/components/ui/SVG/ShirtSVG"

export default function HomePage() {
  const { user, isLoading } = useAuthStore()
  const { featuredProductsList, categories } = useAppStore()
  const { t, dir } = useI18nStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/")
    }
  }, [user, isLoading, router])



  return (
    <>
      <main className={cn("w-full overflow-hidden relative")}>
        <SunSVG className="absolute top-25 -left-25 z-0 pointer-events-none w-50 h-50 rotate-65 opacity-30 text-emerald-600" />
        <FishSVG className="absolute top-[40dvh] left-15 z-0 pointer-events-none w-20 h-20 rotate-45 opacity-30 text-emerald-600" />
        <StoreSVG className="absolute top-[70dvh] left-2 z-0 pointer-events-none w-30 h-30 rotate-25 opacity-30 text-emerald-600" />
        <LampDeskSVG className="absolute top-[100dvh] left-15 z-0 pointer-events-none w-30 h-30 -rotate-25 opacity-30 text-emerald-600" />
        <SunSVG className="absolute top-[60dvh] -right-25 z-0 pointer-events-none w-50 h-50 rotate-65 opacity-30 text-cyan-600" />
        <GiftSVG className="absolute top-70 right-0 z-0 pointer-events-none w-40 h-40 -rotate-45 opacity-30 text-cyan-600" />
        <CakeSVG className="absolute top-[10dvh] right-2 z-0 pointer-events-none w-20 h-20 rotate-25 opacity-30 text-cyan-600" />
        <GamepadSVG className="absolute top-[90dvh] right-2 z-0 pointer-events-none w-40 h-40 rotate-25 opacity-30 text-cyan-600" />
        <ShirtSVG className="absolute top-[120dvh] right-10 z-0 pointer-events-none w-25 h-25 -rotate-25 opacity-30 text-cyan-600"/>
        <div className={`${cn('min-h-screen container mx-auto h-[3200px]')}`}>
          {/* <TreePalmSVG className="absolute top-1/2 -left-10 z-0 pointer-events-none w-50 h-50 rotate-65 opacity-30"/> */}
          <div className="flex justify-between gap-4 items-center w-full h-[40dvh]  py-4 ">
            <CategoriesList items={categories} dir={dir} />
            <Slider items={featuredProductsList} dir={dir} />
          </div>
          <SliderRounded items={categories} dir={dir} className="mx-auto" />
        </div>
      </main>
    </>
  )
}
