import { Skeleton } from "@/components/shadcnUI/skeleton"
import { Card, CardContent } from "@/components/shadcnUI/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center space-y-6">
            <Skeleton className="h-24 w-24 rounded-full mx-auto" />
            <Skeleton className="h-10 w-96 mx-auto" />
            <Skeleton className="h-5 w-full max-w-lg mx-auto" />
            <Skeleton className="h-5 w-3/4 max-w-md mx-auto" />
            <div className="border-t pt-6 mt-6 space-y-3">
              <Skeleton className="h-4 w-full max-w-sm mx-auto" />
              <Skeleton className="h-8 w-32 mx-auto" />
            </div>
            <div className="flex gap-4 justify-center pt-4">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
