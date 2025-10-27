import { cn } from "@/lib/utils"
import { Sparkles, TrendingDown, Percent } from "lucide-react"

interface SectionHeaderProps {
  dir: string
  translations?: {
    title?: string
    subtitle?: string
  }
}

export const SectionHeader = ({ dir, translations }: SectionHeaderProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center text-center mb-8 space-y-4 rounded-2xl p-6",
      "bg-gradient-to-br from-sky-100 via-purple-100 to-teal-100",
      dir === "rtl" ? "text-right" : "text-left"
    )}>
      {/* Icon Badge */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-xl opacity-50 animate-pulse" />
        <div className="relative bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl shadow-lg">
          <Percent className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <h2 className={cn(
          "text-3xl sm:text-4xl md:text-5xl font-bold",
          "bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent",
          "flex items-center justify-center gap-3"
        )}>
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 animate-pulse" />
          {translations?.title || (dir === "rtl" ? "عروض خاصة وخصومات حصرية" : "Special Deals & Exclusive Discounts")}
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 animate-pulse" />
        </h2>
        
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          {translations?.subtitle || (dir === "rtl" 
            ? "اكتشف أفضل العروض والخصومات على منتجاتنا المميزة - وفر الآن قبل انتهاء العرض!" 
            : "Discover the best deals and discounts on our featured products - Save now before the offer ends!"
          )}
        </p>
      </div>

      {/* Discount Badge */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full shadow-lg animate-bounce">
        <TrendingDown className="w-5 h-5" />
        <span className="font-bold text-sm sm:text-base">
          {dir === "rtl" ? "خصومات تصل إلى 70%" : "Up to 70% OFF"}
        </span>
      </div>
    </div>
  )
}
