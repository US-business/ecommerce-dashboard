import { Skeleton } from "@/components/shadcnUI/skeleton"
import { Card, CardContent } from "@/components/shadcnUI/card"

/**
 * CMS Page Skeleton
 * Loading state for static/content pages (About, Terms, Privacy, etc.)
 */
export function CMSPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Page Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-5 w-full max-w-2xl mx-auto mb-2" />
          <Skeleton className="h-5 w-3/4 max-w-xl mx-auto" />
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1 */}
          <Card>
            <CardContent className="p-8 space-y-4">
              <Skeleton className="h-8 w-64 mb-6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card>
            <CardContent className="p-8 space-y-4">
              <Skeleton className="h-8 w-56 mb-6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              
              {/* List Items */}
              <div className="space-y-3 pt-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-6 w-6 rounded-full flex-shrink-0 mt-0.5" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card>
            <CardContent className="p-8 space-y-4">
              <Skeleton className="h-8 w-72 mb-6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              
              {/* Highlighted Box */}
              <Card className="bg-muted/50 mt-6">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Section 4 - FAQ Style */}
          <Card>
            <CardContent className="p-8 space-y-6">
              <Skeleton className="h-8 w-64 mb-6" />
              
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3 pb-6 border-b last:border-0">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-4/5" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-8 text-center space-y-4">
              <Skeleton className="h-8 w-96 mx-auto" />
              <Skeleton className="h-5 w-full max-w-2xl mx-auto" />
              <Skeleton className="h-5 w-3/4 max-w-xl mx-auto" />
              <div className="flex gap-4 justify-center pt-4">
                <Skeleton className="h-12 w-40" />
                <Skeleton className="h-12 w-40" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/**
 * FAQ Page Skeleton
 * Specific loading state for FAQ page
 */
export function FAQPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-5 w-full max-w-2xl mx-auto mb-2" />
          <Skeleton className="h-5 w-3/4 max-w-xl mx-auto" />
        </div>

        <div className="grid gap-6 lg:grid-cols-4 max-w-6xl mx-auto">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-5 w-32 mb-4" />
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* FAQ List */}
          <div className="lg:col-span-3 space-y-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                    <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Contact Page Skeleton
 */
export function ContactPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-5 w-full max-w-2xl mx-auto" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8 space-y-6">
                <Skeleton className="h-7 w-48 mb-6" />
                
                {/* Form Fields */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-32 w-full" />
                </div>
                
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
