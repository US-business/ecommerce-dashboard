import { cn } from "@/lib/utils"

interface ProductStatusBannerProps {
  isVisible: boolean
  text: string
  className?: string
}

export const ProductStatusBanner = ({ isVisible, text, className }: ProductStatusBannerProps) => {
  if (!isVisible) return null

  return (
    <div
      className={cn(
        "absolute top-[15%] md:top-[8%] left-[-35%] w-[100%] py-1 text-center font-bold",
        "bg-red-600/70 text-white transform -rotate-45 origin-center",
        "shadow-lg z-20 text-sm",
        className
      )}
    >
      {text}
    </div>
  )
}
