import { FormSkeleton } from "@/components/ui/skeletons"
import { Card, CardContent } from "@/components/shadcnUI/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center mb-6 space-y-2">
              <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-muted animate-pulse" />
              <div className="h-8 w-48 mx-auto bg-muted rounded animate-pulse" />
              <div className="h-4 w-64 mx-auto bg-muted rounded animate-pulse" />
            </div>
            <FormSkeleton fields={2} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
