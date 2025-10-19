import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/shadcnUI/breadcrumb";
import BackLink from "@/components/ui/BackLink";
import { getProduct, getProductsByIds } from "@/lib/actions/products";
import { cn } from "@/lib/utils";
import { Home, ArrowLeft, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { ProductProps } from "@/types/product"
import ImageItem from "@/app/[lang]/(site)/products/[id]/_components/ImageItem";
import InfoItem from "@/app/[lang]/(site)/products/[id]/_components/InfoItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Separator } from "@/components/shadcnUI/separator";
import { Suspense } from "react";
import ProductCard from "@/components/ui/ProductCard/ProductCard";
import { Button } from "@/components/shadcnUI/button";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/utils/structured-data";
import { ReviewsList } from "@/components/ui/reviews";
import { getProductReviews } from "@/lib/actions/reviews";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth.config";
import { ProductDetailSkeleton } from "@/components/ui/skeletons/ProductDetailSkeleton";

export async function generateMetadata({ params }: { params: Promise<{ id: string, lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  const lang = resolvedParams.lang || 'ar';
  const idAsNumber = parseInt(productId);

  const cookieStore = await cookies();
  const locale = cookieStore.get("preferred-locale")?.value || "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  const { data: product } = await getProduct(idAsNumber);

  if (!productId || !product) {
    return { title: dir === 'rtl' ? 'المنتج غير متاحة' : 'Product Not Found | Dubai-Trading' };
  }


  const categoryName = dir === 'rtl' ? product?.nameAr : product?.nameEn || 'Dubai-Trading';
  const description = `Browse products in the ${categoryName} category. Find the best deals at Dubai-Trading.`;

  return {
    title: dir === 'rtl' ? ` Dubai-Trading | ${categoryName} ` : `${categoryName} | Dubai-Trading`,
    description: description,
  };
}

 

export default async function ProductPage({ params }: { params: Promise<{ id: string, lang: string }> }) {

  const resolvedParams = await params;
  const { id, lang } = resolvedParams;
  const idAsNumber = parseInt(id);

  const cookieStore = await cookies();
  const locale = cookieStore.get("preferred-locale")?.value || "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  const { data: product } = await getProduct(idAsNumber);
  if (!product) {
    return <div>Product Not Found</div>;
  }
 
  // Get current user session
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  // Get product reviews
  const reviewsData = await getProductReviews(idAsNumber);
  const averageRating = reviewsData.averageRating || 0;
  const totalReviews = reviewsData.totalReviews || 0;

  // Generate Structured Data for SEO
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const productUrl = `${baseUrl}/${locale}/product/${product.id}`;
  
  const productStructuredData = generateProductSchema({
    name: dir === 'rtl' ? product.nameAr : product.nameEn,
    description: dir === 'rtl' ? product.descriptionAr || product.nameAr : product.descriptionEn || product.nameEn,
    image: product.images || [],
    price: product.price || '0',
    currency: 'USD',
    availability: (product.quantityInStock && product.quantityInStock > 0) ? 'InStock' : 'OutOfStock',
    brand: product.brand,
    sku: product.sku,
    rating: totalReviews > 0 ? { value: averageRating, count: totalReviews } : undefined,
  });

  const breadcrumbStructuredData = generateBreadcrumbSchema([
    { name: dir === 'rtl' ? 'الرئيسية' : 'Home', url: `${baseUrl}/${locale}` },
    { name: dir === 'rtl' ? 'المنتجات' : 'Products', url: `${baseUrl}/${locale}/products` },
    { name: dir === 'rtl' ? product.category?.nameAr : product.category?.nameEn, url: `${baseUrl}/${locale}/products?category=${product.category?.slug}` },
    { name: dir === 'rtl' ? product.nameAr : product.nameEn, url: productUrl },
  ]);

  // Get related products if available
  let relatedProducts: any[] = [];
  if (product.relatedProductIds && product.relatedProductIds.length > 0) {
    const relatedRes = await getProductsByIds(product.relatedProductIds);
    relatedProducts = relatedRes.success ? (relatedRes.data ?? []) : []; 
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      
      <main dir={dir} className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Navigation - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <BackLink dir={dir} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm sm:text-base" />
          
          <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
            <a href={`/${locale}/products`} className="text-xs sm:text-sm">
              {dir === 'rtl' ? 'جميع المنتجات' : 'All Products'}
            </a>
          </Button>
        </div>

        {/* Breadcrumbs - Enhanced Responsive */}
        <Card className="mb-4 sm:mb-6 shadow-sm">
          <CardContent className="py-2 sm:py-3 px-3 sm:px-6" dir={dir}>
            <Breadcrumb>
              <BreadcrumbList className="flex items-center flex-wrap gap-1 sm:gap-2" role="list">
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/${locale}`} className="flex items-center gap-1 sm:gap-2 hover:text-primary transition-colors text-xs sm:text-sm">
                    <Home className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{dir === 'rtl' ? 'الرئيسية' : 'Home'}</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className={cn("text-xs sm:text-sm", dir === "rtl" ? "rotate-180" : "")} />
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    href={`/${locale}/category/${product?.category?.slug}`}
                    className="hover:text-primary transition-colors text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none"
                    title={dir === "rtl" ? product?.category?.nameAr : product?.category?.nameEn}
                  >
                    {dir === "rtl" ? product?.category?.nameAr : product?.category?.nameEn}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className={cn("text-xs sm:text-sm", dir === "rtl" ? "rotate-180" : "")} />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none" title={dir === "rtl" ? product.nameAr : product.nameEn}>
                    {dir === "rtl" ? product.nameAr : product.nameEn}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </CardContent>
        </Card>

        {/* Main Product Section - Enhanced Responsive */}
        <Card className="mb-6 sm:mb-8 overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0">
              {/* Product Images */}
              <div className="bg-white p-4 sm:p-6 lg:p-8 order-1">
                <ImageItem product={product} dir={dir} />
              </div>
              
              {/* Product Info */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 lg:p-8 order-2">
                <InfoItem product={product} dir={dir} lang={locale} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details Section - Enhanced Responsive */}
        {(product.descriptionEn || product.descriptionAr || product.detailsEn || product.detailsAr) && (
          <Card className="mb-6 sm:mb-8 shadow-md">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl flex items-center gap-2">
                <span className="text-primary text-base sm:text-lg lg:text-xl">📋</span>
                <span className="break-words">{dir === 'rtl' ? 'تفاصيل المنتج' : 'Product Details'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 px-4 sm:px-6">
              {/* Description */}
              {(product.descriptionEn || product.descriptionAr) && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900">
                    {dir === 'rtl' ? 'الوصف' : 'Description'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">
                    {dir === 'rtl' ? product.descriptionAr : product.descriptionEn}
                  </p>
                </div>
              )}

              {/* Product Details */}
              {((product.detailsEn && product.detailsEn.length > 0) || (product.detailsAr && product.detailsAr.length > 0)) && (
                <div>
                  <Separator className="my-4 sm:my-6" />
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">
                    {dir === 'rtl' ? 'المواصفات' : 'Specifications'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {(dir === 'rtl' ? product.detailsAr : product.detailsEn)?.map((detail : any , index : number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-colors border border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-1 sm:mb-2 flex items-start gap-2 text-sm sm:text-base">
                          <span className="text-primary flex-shrink-0 mt-0.5 sm:mt-0">•</span>
                          <span className="break-words">{detail.title}</span>
                        </h4>
                        <p className="text-gray-700 text-xs sm:text-sm break-words leading-relaxed">{detail.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Customer Reviews Section - Responsive */}
        <div className="mb-6 sm:mb-8">
          <ReviewsList
            productId={idAsNumber}
            currentUserId={currentUserId}
            dir={dir}
            lang={locale}
          />
        </div>

        {/* Related Products - Enhanced Responsive */}
        {relatedProducts.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white px-4 sm:px-6 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl flex items-center gap-2">
                  <span className="text-primary text-base sm:text-lg lg:text-xl">🔗</span>
                  <span className="break-words">{dir === 'rtl' ? 'منتجات ذات صلة' : 'Related Products'}</span>
                </CardTitle>
                <Button variant="ghost" size="sm" className="w-full sm:w-auto" asChild>
                  <a href={`/${locale}/products?category=${product?.category?.slug}`} className="text-xs sm:text-sm">
                    {dir === 'rtl' ? 'عرض المزيد' : 'View More'}
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
              <Suspense fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden animate-pulse">
                      <CardContent className="p-0">
                        <div className="bg-gray-200 h-40 sm:h-48 w-full"></div>
                        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                          <div className="bg-gray-200 h-3 sm:h-4 rounded"></div>
                          <div className="bg-gray-200 h-3 sm:h-4 rounded w-3/4"></div>
                          <div className="flex items-center justify-between">
                            <div className="bg-gray-200 h-5 sm:h-6 w-16 sm:w-20 rounded"></div>
                            <div className="bg-gray-200 h-6 sm:h-8 w-12 sm:w-16 rounded"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              }>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {relatedProducts.slice(0, 4).map((relatedProduct) => (
                    <ProductCard 
                      key={relatedProduct.id} 
                      product={relatedProduct} 
                      dir={dir}
                      lang={locale}
                      hiddenButtonCart
                    />
                  ))}
                </div>
              </Suspense>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
    </>
  );
}
