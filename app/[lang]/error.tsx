"use client"

import { useEffect } from "react"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent } from "@/components/shadcnUI/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"
import { logger } from "@/lib/utils"

/**
 * Error Page Component
 * Handles runtime errors gracefully with user-friendly UI
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to our logging system
    logger.error("Page Error", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    })
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-2xl shadow-2xl animate-fade-in">
        <CardContent className="p-8 md:p-12 text-center space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
              </div>
              <div className="absolute inset-0 bg-red-200/30 rounded-full animate-ping" />
            </div>
          </div>

          {/* Error Messages */}
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Something went wrong!
            </h2>
            <p className="text-lg text-muted-foreground">
              حدث خطأ ما!
            </p>
            <p className="text-base text-muted-foreground max-w-md mx-auto">
              We encountered an unexpected error. Please try again.
              <br />
              واجهنا خطأً غير متوقع. يرجى المحاولة مرة أخرى.
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === "development" && error.message && (
              <details className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg text-left">
                <summary className="cursor-pointer text-sm font-medium text-red-600 dark:text-red-400">
                  Error Details (Dev Only)
                </summary>
                <pre className="mt-2 text-xs text-red-800 dark:text-red-300 overflow-auto">
                  {error.message}
                </pre>
                {error.digest && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    Error ID: {error.digest}
                  </p>
                )}
              </details>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button onClick={reset} size="lg" className="group">
              <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              <span>Try Again | حاول مرة أخرى</span>
            </Button>

            <Button asChild size="lg" variant="outline">
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span>Go Home | الرئيسية</span>
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              If this problem persists, please contact support.
              <br />
              إذا استمرت المشكلة، يرجى الاتصال بالدعم.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
