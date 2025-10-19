"use client"

import { Card, CardContent, CardHeader } from "@/components/shadcnUI/card"
import { cn } from "@/lib/utils"

interface SignInSkeletonProps {
    dir?: "ltr" | "rtl"
}

export function SignInSkeleton({ dir = "ltr" }: SignInSkeletonProps) {
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
                        <div className="h-9 w-48 bg-gray-200/60 rounded-md animate-pulse" />
                    </div>

                    {/* Subtitle */}
                    <div className="flex justify-center">
                        <div className="h-5 w-64 bg-gray-200/60 rounded-md animate-pulse" />
                    </div>
                </div>

                {/* Card Skeleton */}
                <Card className="shadow-xl border-0 overflow-hidden">
                    <CardHeader className="space-y-3">
                        {/* Card Title */}
                        <div className="flex justify-center">
                            <div className="h-8 w-40 bg-gray-200/60 rounded-md animate-pulse" />
                        </div>

                        {/* Card Description */}
                        <div className="flex justify-center">
                            <div className="h-5 w-56 bg-gray-200/60 rounded-md animate-pulse" />
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <div className="h-4 w-20 bg-gray-200/60 rounded animate-pulse" />
                            <div className="h-10 w-full bg-gray-200/60 rounded-md animate-pulse" />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200/60 rounded animate-pulse" />
                            <div className="h-10 w-full bg-gray-200/60 rounded-md animate-pulse" />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-gray-200/60 rounded animate-pulse" />
                            <div className="h-4 w-20 bg-gray-200/60 rounded animate-pulse" />
                        </div>

                        {/* Submit Button */}
                        <div className="h-10 w-full bg-gray-200/60 rounded-md animate-pulse" />

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

                        {/* Sign Up Link */}
                        <div className="flex justify-center gap-1">
                            <div className="h-5 w-32 bg-gray-200/60 rounded animate-pulse" />
                            <div className="h-5 w-24 bg-gray-200/60 rounded animate-pulse" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
