import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductReviewsProps {
  averageRating: number
  totalReviews: number
  isLoading: boolean
  className?: string
}

export const ProductReviews = ({
  averageRating,
  totalReviews,
  isLoading,
  className
}: ProductReviewsProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4 transition-colors",
              i < Math.floor(averageRating)
                ? "text-yellow-400 fill-yellow-400"
                : i < Math.ceil(averageRating) && averageRating % 1 !== 0
                ? "text-yellow-400 fill-yellow-400 opacity-50"
                : "text-gray-300 fill-gray-300"
            )}
          />
        ))}
      </div>
      {!isLoading && (
        <span className="text-sm text-gray-500" dir="ltr">
          {averageRating > 0 ? `${averageRating.toFixed(1)}` : '0.0'} ({totalReviews})
        </span>
      )}
    </div>
  )
}
