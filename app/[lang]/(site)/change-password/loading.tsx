import { FormSkeleton } from "@/components/ui/skeletons"
import { Card } from "@/components/shadcnUI/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <FormSkeleton fields={3} />
        </div>
      </div>
    </div>
  )
}
