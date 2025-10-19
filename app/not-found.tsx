import Link from "next/link"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent } from "@/components/shadcnUI/card"
import { Home, ArrowRight } from "lucide-react"

/**
 * Global 404 Not Found Page (Root Level)
 * Redirects users to the appropriate language version
 */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
          <Card className="w-full max-w-2xl shadow-2xl">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              {/* 404 Number */}
              <div className="relative">
                <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  404
                </h1>
              </div>

              {/* Error Message */}
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Page Not Found
                </h2>
                <p className="text-lg text-gray-600">
                  الصفحة غير موجودة
                </p>
                <p className="text-base text-gray-500 max-w-md mx-auto">
                  The page you're looking for doesn't exist.
                  <br />
                  الصفحة التي تبحث عنها غير موجودة.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button asChild size="lg">
                  <Link href="/ar" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    <span>العودة للرئيسية</span>
                  </Link>
                </Button>

                <Button asChild size="lg" variant="outline">
                  <Link href="/en" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    <span>Back to Home</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
