import { Skeleton } from "@/components/shadcnUI/skeleton"
import { Card, CardContent } from "@/components/shadcnUI/card"
import { cn } from "@/lib/utils"

interface HomePageSkeletonProps {
  dir?: 'ltr' | 'rtl';
}

export function HomePageSkeleton({ dir = 'ltr' }: HomePageSkeletonProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section Skeleton */}
      <section className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4">
          <div className={cn(
            "grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto",
            dir === 'rtl' && "lg:grid-cols-2"
          )}>
            {/* Content Skeleton */}
            <div className={cn(
              "space-y-8 text-center lg:text-left animate-pulse",
              dir === 'rtl' && "lg:text-right"
            )}>
              {/* Badge */}
              <Skeleton className="h-8 w-32 mx-auto lg:mx-0" />

              {/* Main Heading */}
              <div className="space-y-4">
                <Skeleton className="h-16 w-full max-w-2xl mx-auto lg:mx-0" />
                <Skeleton className="h-16 w-3/4 max-w-xl mx-auto lg:mx-0" />
                <Skeleton className="h-6 w-full max-w-2xl mx-auto lg:mx-0" />
                <Skeleton className="h-6 w-2/3 max-w-lg mx-auto lg:mx-0" />
              </div>

              {/* CTA Buttons */}
              <div className={cn(
                "flex flex-col sm:flex-row gap-4 justify-center lg:justify-start",
                dir === 'rtl' && "lg:justify-end"
              )}>
                <Skeleton className="h-14 w-48" />
                <Skeleton className="h-14 w-48" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="w-6 h-6 mx-auto mb-2" />
                    <Skeleton className="h-8 w-16 mx-auto mb-1" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Skeleton */}
            <div className={cn(
              "relative lg:flex justify-center items-center hidden animate-pulse",
              dir === 'rtl' && "lg:flex"
            )}>
              <div className="relative">
                <Skeleton className="w-96 h-96 rounded-3xl" />
                <Skeleton className="absolute -top-4 -right-4 w-20 h-20 rounded-full" />
                <Skeleton className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <Skeleton className="h-6 w-40 mx-auto mb-4" />
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
          </div>

          {/* Features Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <Skeleton className="w-16 h-16 rounded-2xl" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        {/* Categories and Main Carousel Skeleton */}
        <div className="flex flex-col lg:flex-row justify-between gap-8 items-start mb-12">
          {/* Categories Sidebar Skeleton */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>

          {/* Main Carousel Skeleton */}
          <div className="flex-1">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>

        {/* Categories Carousel Skeleton */}
        <div className="mb-12">
          <Skeleton className="h-32 w-full max-w-4xl mx-auto rounded-xl" />
        </div>

        {/* Category Products Sections Skeleton */}
        <div className="space-y-12">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, j) => (
                  <Card key={j} className="animate-pulse">
                    <CardContent className="p-0">
                      <Skeleton className="w-full h-48 rounded-t-lg" />
                      <div className="p-4">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-3" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section Skeleton */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-80 mx-auto mb-6" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-4" />
            <Skeleton className="h-6 w-3/4 max-w-xl mx-auto" />
          </div>

          {/* Testimonials Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-6" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-24 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-12 w-20 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePageSkeleton
