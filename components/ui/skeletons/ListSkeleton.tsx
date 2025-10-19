import { Skeleton } from "@/components/shadcnUI/skeleton"
import { Card, CardContent } from "@/components/shadcnUI/card"

/**
 * List Item Skeleton
 * Loading state for list items
 */
export function ListItemSkeleton() {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Avatar/Image */}
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
          
          {/* Content */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Action Button */}
          <Skeleton className="h-9 w-20 flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * List Skeleton
 * Multiple list items
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Horizontal List Item Skeleton
 * For horizontal scrolling lists
 */
export function HorizontalListItemSkeleton() {
  return (
    <Card className="min-w-[280px] overflow-hidden">
      <Skeleton className="h-40 w-full" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-9 w-full mt-2" />
      </CardContent>
    </Card>
  )
}

/**
 * Horizontal List Skeleton
 * For horizontal scrolling lists
 */
export function HorizontalListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {[...Array(count)].map((_, i) => (
        <HorizontalListItemSkeleton key={i} />
      ))}
    </div>
  )
}
