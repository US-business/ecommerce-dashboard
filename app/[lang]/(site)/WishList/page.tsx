import { getWishlistFull } from "@/lib/actions/wishlist"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Heart, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/shadcnUI/breadcrumb"
import BackLink from "@/components/ui/BackLink"
import { cookies } from "next/headers"
import { getNextAuthUser } from "@/lib/auth/guards"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { type Locale } from "@/lib/i18n/i18n-config"
import WishlistItems from "./_components/WishlistItems"
import WishlistActions from "./_components/WishlistActions"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies()
    const locale = cookieStore.get("preferred-locale")?.value as Locale || "ar"
    const dir = locale === "ar" ? "rtl" : "ltr"

    return {
        title: dir === 'rtl' ? 'قائمة الأمنيات | Dubai-Trading' : 'Wishlist | Dubai-Trading',
        description: dir === 'rtl'
            ? 'شاهد قائمة منتجاتك المفضلة واحتفظ بها للشراء لاحقاً'
            : 'View your favorite products and save them for later purchase',
        keywords: dir === 'rtl'
            ? 'قائمة الأمنيات, المفضلة, منتجات, Dubai-Trading'
            : 'wishlist, favorites, products, Dubai-Trading',
    }
}

export default async function WishlistPage({
    params,
}: {
    params: Promise<{ lang: string }>
}) {
    const resolvedParams = await params
    const lang = resolvedParams.lang as Locale

    const cookieStore = await cookies()
    const locale = cookieStore.get("preferred-locale")?.value as Locale || "ar"
    const dir = locale === "ar" ? "rtl" : "ltr"
    const dictionary = await getDictionary(locale)

    const user = await getNextAuthUser()

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="max-w-md w-full mx-4">
                    <CardContent className="pt-6 text-center space-y-4">
                        <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                            <Heart className="w-12 h-12 text-gray-400" />
                        </div>
                        <h1 className={cn("text-2xl font-bold", dir === "rtl" && "text-right")}>
                            {dictionary.wishlist.loginRequired}
                        </h1>
                        <p className={cn("text-gray-600", dir === "rtl" && "text-right")}>
                            {dir === "rtl"
                                ? "يرجى تسجيل الدخول لعرض قائمة الأمنيات الخاصة بك"
                                : "Please login to view your wishlist"}
                        </p>
                        <BackLink dir={dir} className="my-4" href="/auth/signin" text={dictionary.common.login} />
                    </CardContent>
                </Card>
            </div>
        )
    }

    const wishlist = user?.id ? await getWishlistFull(user.id) : null

    // Empty wishlist state
    if (wishlist?.success && wishlist?.data?.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md mx-auto px-4">
                    <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                        <Heart className="w-12 h-12 text-gray-400" />
                    </div>
                    <h1 className={cn("text-2xl font-bold text-gray-900", dir === "rtl" && "text-right")}>
                        {dictionary.wishlist.emptyWishlist}
                    </h1>
                    <p className={cn("text-gray-600", dir === "rtl" && "text-right")}>
                        {dictionary.wishlist.emptyWishlistDescription}
                    </p>
                    <BackLink
                        dir={dir}
                        className="my-4"
                        href="/products"
                        text={dictionary.wishlist.startBrowsing}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Breadcrumbs */}
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">{dictionary.common.home}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className={cn(dir === "rtl" && "rotate-180")} />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{dictionary.wishlist.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Wishlist Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
                                    <span className="flex items-center gap-2">
                                        <Heart className="w-5 h-5 fill-current text-red-500" />
                                        {dictionary.wishlist.title} ({wishlist?.data?.items.length || 0}{" "}
                                        {dictionary.wishlist.items})
                                    </span>
                                    <BackLink dir={dir} />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {user?.id && wishlist?.data && (
                                    <WishlistItems
                                        items={wishlist.data.items}
                                        userId={user.id}
                                        dir={dir}
                                        dictionary={dictionary}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className={cn(dir === "rtl" && "text-right")}>
                                    {dir === "rtl" ? "الإجراءات السريعة" : "Quick Actions"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {user?.id && (
                                    <WishlistActions
                                        userId={user.id}
                                        itemCount={wishlist?.data?.items.length || 0}
                                        dir={dir}
                                        dictionary={dictionary}
                                    />
                                )}
                            </CardContent>
                        </Card>

                        {/* Info Card */}
                        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                            <CardContent className="pt-6">
                                <div className={cn("space-y-4", dir === "rtl" && "text-right")}>
                                    <div className="flex items-start gap-3">
                                        <Heart className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold mb-1">
                                                {dir === "rtl" ? "احفظ مفضلاتك" : "Save Your Favorites"}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {dir === "rtl"
                                                    ? "احتفظ بالمنتجات التي تعجبك لشرائها لاحقاً"
                                                    : "Keep the products you love for later purchase"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <ShoppingBag className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-semibold mb-1">
                                                {dir === "rtl" ? "أضف للسلة بسهولة" : "Easy Add to Cart"}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {dir === "rtl"
                                                    ? "انقل المنتجات من المفضلة إلى السلة بضغطة واحدة"
                                                    : "Move products from wishlist to cart with one click"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
