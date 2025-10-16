import type { Metadata } from "next"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { type Locale } from "@/lib/i18n/i18n-config"
import { getAllProductsActions } from "@/lib/actions/products"
import ProductCard from "@/components/ui/ProductCard/ProductCard"
import { Badge } from "@/components/shadcnUI/badge"
import { Card, CardContent } from "@/components/shadcnUI/card"
import { Percent, Clock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);

  return {
    title: `${dictionary.cms.offers.title} | متجر إلكتروني`,
    description: dictionary.cms.offers.description,
  }
}

export default async function OffersPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  // Get products with offers
  const productsRes = await getAllProductsActions(1, 20, undefined, false, undefined, true)
  const products = productsRes.success && productsRes.data ? productsRes.data : []

  // Filter products with discounts
  const offerProducts = products.filter(product => product.discountType && product.discountType !== 'none' && product.discountValue)

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Percent className="w-8 h-8 text-primary" />
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2">
            {dir === "rtl" ? "عروض خاصة" : "Special Offers"}
          </Badge>
        </div>

        <h1 className="text-4xl font-bold mb-4">
          {dictionary.cms.offers.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {dictionary.cms.offers.description}
        </p>
      </div>

      {/* Offer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6 text-center">
            <Zap className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-700 dark:text-green-300 mb-1">
              {offerProducts.length}+
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              {dir === "rtl" ? "منتج في العروض" : "Products on Offer"}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
              24/7
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              {dir === "rtl" ? "العروض متاحة" : "Offers Available"}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6 text-center">
            <Percent className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-1">
              حتى 70%
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">
              {dir === "rtl" ? "خصم يومي" : "Daily Discount"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      {offerProducts.length > 0 ? (
        <div className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
          dir === "rtl" ? "grid-cols-1" : "grid-cols-1"
        )}>
          {offerProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              dir={dir}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <Percent className="w-12 h-12 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {dir === "rtl" ? "لا توجد عروض حالياً" : "No Offers Available"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  {dir === "rtl"
                    ? "تابعونا للحصول على أحدث العروض والخصومات. سنضيف عروض جديدة قريباً!"
                    : "Follow us for the latest offers and discounts. We'll add new offers soon!"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
