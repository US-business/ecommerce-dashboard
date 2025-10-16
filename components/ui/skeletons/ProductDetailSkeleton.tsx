import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Skeleton } from "@/components/shadcnUI/skeleton"
import { Separator } from "@/components/shadcnUI/separator"
import { cn } from "@/lib/utils"

interface ProductDetailSkeletonProps {
  dir?: 'ltr' | 'rtl';
}

export function ProductDetailSkeleton({ dir = 'ltr' }: ProductDetailSkeletonProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Navigation Skeleton */}
        <div className={cn("flex items-center justify-between mb-6", dir === "rtl" && "flex-row-reverse")}>
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Breadcrumbs Skeleton */}
        <Card className="mb-6">
          <CardContent className="py-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Main Product Section Skeleton */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Product Images Skeleton */}
              <div className="bg-white p-6">
                <div className="space-y-4 flex flex-col sm:flex-row h-[55dvh]">
                  {/* Thumbnails */}
                  <div className="flex flex-row sm:flex-col items-start gap-3 p-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex-shrink-0" />
                    ))}
                  </div>
                  {/* Main Image */}
                  <Skeleton className="flex-1 w-full h-full rounded-lg" />
                </div>
              </div>

              {/* Product Info Skeleton */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 lg:p-8">
                <div className="space-y-6">
                  {/* Title and Actions */}
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-6 w-20" />
                        </div>
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-3/4" />
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <Skeleton className="h-10 w-10 rounded-md" />
                      </div>
                    </div>
                  </div>

                  {/* Price Skeleton */}
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-6 w-32" />
                  </div>

                  {/* Warranty Skeleton */}
                  <Skeleton className="h-6 w-40" />
                  <Separator className="my-2" />

                  {/* Stock Skeleton */}
                  <Skeleton className="h-6 w-36" />
                  <Separator className="my-2" />

                  {/* Details Skeleton */}
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>

                  {/* Description Skeleton */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>

                  {/* Quantity and Actions Skeleton */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    </div>
                    <Skeleton className="h-12 w-full" />
                  </div>

                  {/* Shipping Info Skeleton */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details Section Skeleton */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <Skeleton className="h-6 w-32 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Specifications */}
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section Skeleton */}
        <div className="mb-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-48" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List Skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Related Products Skeleton */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                <Skeleton className="h-8 w-48" />
              </CardTitle>
              <Skeleton className="h-8 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default ProductDetailSkeleton