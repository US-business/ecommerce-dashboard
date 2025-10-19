import { Skeleton } from "@/components/shadcnUI/skeleton"
import { Card, CardContent, CardHeader } from "@/components/shadcnUI/card"

/**
 * Account Page Skeleton
 * Loading state for user account page
 */
export function AccountSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card - Left Side */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Avatar */}
                  <Skeleton className="h-32 w-32 rounded-full" />
                  
                  {/* Name & Email */}
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-7 w-40 mx-auto" />
                    <Skeleton className="h-4 w-48 mx-auto" />
                  </div>

                  {/* Badge */}
                  <Skeleton className="h-6 w-24 rounded-full" />

                  {/* Edit Button */}
                  <Skeleton className="h-10 w-full" />
                </div>

                {/* Divider */}
                <div className="my-6 border-t" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="text-center">
                      <Skeleton className="h-8 w-16 mx-auto mb-1" />
                      <Skeleton className="h-4 w-20 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Right Side */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full max-w-md" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <Card key={i} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Skeleton className="h-10 w-40" />
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="text-right space-y-2">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
