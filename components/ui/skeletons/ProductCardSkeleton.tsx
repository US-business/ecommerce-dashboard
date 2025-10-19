import { Skeleton } from "@/components/shadcnUI/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/shadcnUI/card"

/**
 * Product Card Skeleton
 * Loading state for product cards
 */
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Skeleton className="h-full w-full" />
      </div>

      <CardHeader className="space-y-2">
        {/* Product Title */}
        <Skeleton className="h-5 w-3/4" />
        
        {/* Category */}
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>

        {/* Price and Discount */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20" /> {/* Price */}
          <Skeleton className="h-4 w-16" /> {/* Original price */}
          <Skeleton className="h-5 w-12 rounded-full" /> {/* Discount badge */}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Skeleton className="h-10 flex-1" /> {/* Add to cart button */}
        <Skeleton className="h-10 w-10" /> {/* Favorite button */}
      </CardFooter>
    </Card>
  )
}

/**
 * Product Card Grid Skeleton
 * Multiple product cards for grid view
 */
export function ProductCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
