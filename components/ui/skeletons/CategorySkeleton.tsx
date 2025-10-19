import { Skeleton } from "@/components/shadcnUI/skeleton"
import { Card, CardContent, CardHeader } from "@/components/shadcnUI/card"

/**
 * Category Page Skeleton
 * Loading state for category products page
 */
export function CategoryPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Category Header */}
        <div className="mb-8">
          <Skeleton className="h-12 w-64 mb-3" />
          <Skeleton className="h-5 w-full max-w-2xl mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-2 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <Skeleton className="h-5 w-28" />
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>

                {/* Brands */}
                <div className="space-y-3">
                  <Skeleton className="h-5 w-20" />
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <Skeleton className="h-5 w-24" />
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>

                {/* Apply Filters Button */}
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <Skeleton className="h-5 w-48" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Card key={i} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <CardHeader className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                  </CardContent>
                  <div className="p-4 pt-0 flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
