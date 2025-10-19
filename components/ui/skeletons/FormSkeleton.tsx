import { Skeleton } from "@/components/shadcnUI/skeleton"
import { Card, CardContent, CardHeader } from "@/components/shadcnUI/card"

/**
 * Form Field Skeleton
 * Loading state for form fields
 */
export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" /> {/* Label */}
      <Skeleton className="h-10 w-full" /> {/* Input */}
    </div>
  )
}

/**
 * Form Skeleton
 * Loading state for forms
 */
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" /> {/* Form Title */}
        <Skeleton className="h-4 w-full max-w-md" /> {/* Description */}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form Fields */}
        {[...Array(fields)].map((_, i) => (
          <FormFieldSkeleton key={i} />
        ))}

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Inline Form Skeleton
 * Compact form without card
 */
export function InlineFormSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(fields)].map((_, i) => (
        <FormFieldSkeleton key={i} />
      ))}
      <Skeleton className="h-10 w-full" /> {/* Submit Button */}
    </div>
  )
}

/**
 * Search Form Skeleton
 * Loading state for search bars
 */
export function SearchFormSkeleton() {
  return (
    <div className="flex gap-2">
      <Skeleton className="h-10 flex-1" /> {/* Search Input */}
      <Skeleton className="h-10 w-10" /> {/* Search Button */}
    </div>
  )
}

/**
 * Filter Form Skeleton
 * Loading state for filter panels
 */
export function FilterFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-24" /> {/* Filter Title */}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Group 1 */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Filter Group 2 */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Apply Filters Button */}
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}
