import { Skeleton } from "@/components/shadcnUI/skeleton"
import { Card, CardContent, CardHeader } from "@/components/shadcnUI/card"

/**
 * Checkout Page Skeleton
 * Loading state for checkout page
 */
export function CheckoutSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <Skeleton className="h-10 w-48 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Checkout Form - Left Side (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Information */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-4 w-64" />
                                    </div>
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="space-y-2">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Method */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-6 w-40" />
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <Card key={i} className="border-2">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Skeleton className="h-5 w-5 rounded-full" />
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-5 w-32" />
                                                        <Skeleton className="h-4 w-48" />
                                                    </div>
                                                </div>
                                                <Skeleton className="h-6 w-16" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-6 w-40" />
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <Card key={i} className="border-2">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-5 w-5 rounded-full" />
                                                <Skeleton className="h-10 w-12" />
                                                <Skeleton className="h-5 w-32" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary - Right Side (1/3) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-4">
                            {/* Order Summary */}
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-40" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Product Items */}
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex gap-3 pb-3 border-b">
                                            <Skeleton className="h-20 w-20 rounded-md flex-shrink-0" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-3 w-2/3" />
                                                <div className="flex justify-between items-center">
                                                    <Skeleton className="h-4 w-12" />
                                                    <Skeleton className="h-5 w-16" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Divider */}
                                    <div className="border-t pt-4 space-y-3">
                                        {/* Subtotal */}
                                        <div className="flex justify-between">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-5 w-20" />
                                        </div>

                                        {/* Shipping */}
                                        <div className="flex justify-between">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-5 w-20" />
                                        </div>

                                        {/* Tax */}
                                        <div className="flex justify-between">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-5 w-20" />
                                        </div>

                                        {/* Discount */}
                                        <div className="flex justify-between text-green-600">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-5 w-20" />
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <Skeleton className="h-6 w-24" />
                                            <Skeleton className="h-7 w-28" />
                                        </div>

                                        {/* Place Order Button */}
                                        <Skeleton className="h-12 w-full rounded-md" />
                                    </div>

                                    {/* Security Badge */}
                                    <div className="flex items-center justify-center gap-2 pt-4 border-t">
                                        <Skeleton className="h-5 w-5" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Icons */}
                            <Card>
                                <CardContent className="p-4">
                                    <Skeleton className="h-4 w-32 mb-3 mx-auto" />
                                    <div className="flex gap-2 justify-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Skeleton key={i} className="h-8 w-12 rounded" />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
