import Link from "next/link"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent } from "@/components/shadcnUI/card"
import { Home, Search, ArrowLeft, ArrowRight } from "lucide-react"

/**
 * 404 Not Found Page
 * Professional and user-friendly error page with bilingual support
 */
export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Card className="w-full max-w-2xl shadow-2xl animate-fade-in">
                <CardContent className="p-8 md:p-12 text-center space-y-6">
                    {/* 404 Animation */}
                    <div className="relative">
                        <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 animate-pulse">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/10 animate-ping" />
                        </div>
                    </div>

                    {/* Error Messages */}
                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                            Page Not Found
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            الصفحة غير موجودة
                        </p>
                        <p className="text-base text-muted-foreground max-w-md mx-auto">
                            The page you're looking for doesn't exist or has been moved.
                            <br />
                            الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <Button asChild size="lg" className="group">
                            <Link href="/ar" className="flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                <span>العودة للرئيسية</span>
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            </Link>
                        </Button>

                        <Button asChild size="lg" variant="outline" className="group">
                            <Link href="/en" className="flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                <span>Back to Home</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>

                    {/* Search Suggestion */}
                    <div className="pt-6 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-3">
                            Or try searching for what you need
                        </p>
                        <Button asChild variant="secondary" size="sm">
                            <Link href="/ar/search" className="flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                <span>Search Products</span>
                            </Link>
                        </Button>
                    </div>

                    {/* Quick Links */}
                    <div className="pt-6 border-t border-border">
                        <p className="text-sm font-medium text-muted-foreground mb-3">
                            Quick Links | روابط سريعة
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/ar/products">منتجات</Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/ar/categories">الفئات</Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/en/products">Products</Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/en/categories">Categories</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

/**
 * Metadata for SEO
 */
export const metadata = {
    title: "404 - Page Not Found | الصفحة غير موجودة",
    description: "The page you are looking for could not be found.",
}
