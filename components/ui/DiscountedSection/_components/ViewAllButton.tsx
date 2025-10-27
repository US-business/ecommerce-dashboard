import { cn } from "@/lib/utils"
import { Sparkles, TrendingDown } from "lucide-react"

interface ViewAllButtonProps {
  lang: string
  dir: string
  translations?: {
    viewAll?: string
  }
}

export const ViewAllButton = ({ lang, dir, translations }: ViewAllButtonProps) => {
  return (
    <div className="mt-10 text-center">
      <a
        href={`/${lang}/products?onSale=true`}
        className={cn(
          "inline-flex items-center gap-2 px-8 py-4",
          "text-base sm:text-lg font-semibold",
          "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500",
          "text-white rounded-full shadow-lg",
          "hover:shadow-2xl hover:scale-105",
          "transition-all duration-300",
          "hover:from-amber-600 hover:via-orange-600 hover:to-red-600"
        )}
      >
        <Sparkles className="w-5 h-5" />
        {translations?.viewAll || (dir === "rtl" ? "عرض جميع العروض" : "View All Deals")}
        <TrendingDown className="w-5 h-5" />
      </a>
    </div>
  )
}
