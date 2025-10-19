import { Skeleton } from "@/components/shadcnUI/skeleton"
import { Card, CardContent } from "@/components/shadcnUI/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-12 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-8">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-24 w-24" />
            </div>

            {/* Addresses */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="border rounded">
                <div className="grid grid-cols-4 gap-4 p-4 bg-muted">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 p-4 border-t">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between border-t pt-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
