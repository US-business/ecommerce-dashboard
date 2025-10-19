"use client"

import { Card, CardContent, CardHeader } from "@/components/shadcnUI/card"
import { cn } from "@/lib/utils"

interface SignUpSkeletonProps {
  dir?: "ltr" | "rtl"
}

export function SignUpSkeleton({ dir = "ltr" }: SignUpSkeletonProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Language Toggle Skeleton */}
      <div className={cn("absolute top-4", dir === "rtl" ? "left-4" : "right-4")}>
        <div className="h-10 w-32 bg-gray-200/60 rounded-md animate-pulse" />
      </div>

      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          {/* Icon */}
          <div className="mx-auto h-12 w-12 bg-gray-200/60 rounded-full animate-pulse" />
          
          {/* Title */}
          <div className="flex justify-center">
            <div className="h-9 w-56 bg-gray-200/60 rounded-md animate-pulse" />
          </div>
          
          {/* Subtitle */}
          <div className="flex justify-center">
            <div className="h-5 w-72 bg-gray-200/60 rounded-md animate-pulse" />
          </div>

          {/* Info Box */}
          <div className="flex justify-center">
            <div className="h-16 w-full bg-blue-100/60 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Card Skeleton */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="space-y-3">
            {/* Card Title */}
            <div className="flex justify-center">
              <div className="h-8 w-32 bg-gray-200/60 rounded-md animate-pulse" />
            </div>
            
            {/* Card Description */}
            <div className="flex justify-center">
              <div className="h-5 w-64 bg-gray-200/60 rounded-md animate-pulse" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200/60 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200/60 rounded-md animate-pulse" />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <div className="h-4 w-28 bg-gray-200/60 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200/60 rounded-md animate-pulse" />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200/60 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200/60 rounded-md animate-pulse" />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200/60 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200/60 rounded-md animate-pulse" />
            </div>

            {/* Address Field */}
            <div className="space-y-2">
              <div className="h-4 w-28 bg-gray-200/60 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200/60 rounded-md animate-pulse" />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200/60 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200/60 rounded-md animate-pulse" />
            </div>

            {/* Submit Button */}
            <div className="h-12 w-full bg-gray-200/60 rounded-lg animate-pulse" />

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <div className="h-5 w-8 bg-white px-2" />
              </div>
            </div>

            {/* Google Button */}
            <div className="h-10 w-full bg-gray-200/60 rounded-md animate-pulse" />

            {/* Continue Shopping Button */}
            <div className="h-10 w-full bg-gray-200/60 rounded-md animate-pulse" />

            {/* Sign In Link */}
            <div className="flex justify-center gap-1">
              <div className="h-5 w-32 bg-gray-200/60 rounded animate-pulse" />
              <div className="h-5 w-20 bg-gray-200/60 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
