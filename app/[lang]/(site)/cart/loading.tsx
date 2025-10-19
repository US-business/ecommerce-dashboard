import { Skeleton } from "@/components/shadcnUI/skeleton"
import { Card, CardContent, CardHeader } from "@/components/shadcnUI/card"

/**
 * Cart Page Loading Skeleton
 * Displays while cart is loading
 */
export default function CartLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Page Title */}
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items Section (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cart Item 1 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
                  
                  {/* Product Info */}
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex items-center gap-4 pt-2">
                      <Skeleton className="h-10 w-32" /> {/* Quantity selector */}
                      <Skeleton className="h-6 w-20" /> {/* Price */}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            {/* Cart Item 2 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex items-center gap-4 pt-2">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            {/* Cart Item 3 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex items-center gap-4 pt-2">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Section (1/3 width) */}
          <div className="space-y-4">
            {/* Coupon Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-10 w-full" /> {/* Coupon input */}
                <Skeleton className="h-10 w-full" /> {/* Apply button */}
              </CardContent>
            </Card>

            {/* Order Summary Card */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>

                {/* Discount */}
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>

                {/* Divider */}
                <div className="border-t pt-4">
                  {/* Total */}
                  <div className="flex justify-between items-center mb-4">
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-7 w-24" />
                  </div>

                  {/* Checkout Button */}
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 justify-center">
                  <Skeleton className="h-8 w-12 rounded" />
                  <Skeleton className="h-8 w-12 rounded" />
                  <Skeleton className="h-8 w-12 rounded" />
                  <Skeleton className="h-8 w-12 rounded" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
