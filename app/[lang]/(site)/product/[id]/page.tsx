import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/shadcnUI/breadcrumb";
import BackLink from "@/components/ui/BackLink";
import { getProduct, getProductsByIds } from "@/lib/actions/products";
import { cn } from "@/lib/utils";
import { Home, ArrowLeft, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { ProductProps } from "@/types/product"
import ImageItem from "@/components/ui/product-details/ImageItem";
import InfoItem from "@/components/ui/product-details/InfoItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Separator } from "@/components/shadcnUI/separator";
import { Suspense } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { Button } from "@/components/shadcnUI/button";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  const idAsNumber = parseInt(productId);

  const cookieStore = await cookies();
  const locale = cookieStore.get("preferred-locale")?.value || "ar"; // default ar
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



export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {

  const resolvedParams = await params;
  const { id } = resolvedParams;
  const idAsNumber = parseInt(id);

  const cookieStore = await cookies();
  const locale = cookieStore.get("preferred-locale")?.value || "ar"; // default ar
  const dir = locale === "ar" ? "rtl" : "ltr";

  const { data: product } = await getProduct(idAsNumber);
  if (!product) {
    return <div>Product Not Found</div>;
  }


  // Get related products if available
  let relatedProducts: any[] = [];
  if (product.relatedProductIds && product.relatedProductIds.length > 0) {
    const relatedRes = await getProductsByIds(product.relatedProductIds);
    relatedProducts = relatedRes.success ? (relatedRes.data ?? []) : []; 
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <BackLink dir={dir} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors" />
          
          <Button variant="outline" size="sm" asChild>
            <a href="/products">
              {dir === 'rtl' ? 'جميع المنتجات' : 'All Products'}
            </a>
          </Button>
        </div>

        {/* Breadcrumbs */}
        <Card className="mb-6">
          <CardContent className="py-3">
            <Breadcrumb>
              <BreadcrumbList className="flex items-center" role="list">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Home className="h-4 w-4" />
                    {dir === 'rtl' ? 'الرئيسية' : 'Home'}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className={cn(dir === "rtl" ? "rotate-180" : "")} />
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    href={`/category/${product?.category?.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {dir === "rtl" ? product?.category?.nameAr : product?.category?.nameEn}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className={cn(dir === "rtl" ? "rotate-180" : "")} />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium">
                    {dir === "rtl" ? product.nameAr : product.nameEn}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </CardContent>
        </Card>

        {/* Main Product Section */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Product Images */}
              <div className="bg-white p-6">
                <ImageItem product={product} dir={dir} />
              </div>
              
              {/* Product Info */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 lg:p-8">
                <InfoItem product={product} dir={dir} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details Section */}
        {(product.descriptionEn || product.descriptionAr || product.detailsEn || product.detailsAr) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                {dir === 'rtl' ? 'تفاصيل المنتج' : 'Product Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              {(product.descriptionEn || product.descriptionAr) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    {dir === 'rtl' ? 'الوصف' : 'Description'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {dir === 'rtl' ? product.descriptionAr : product.descriptionEn}
                  </p>
                </div>
              )}

              {/* Product Details */}
              {((product.detailsEn && product.detailsEn.length > 0) || (product.detailsAr && product.detailsAr.length > 0)) && (
                <div>
                  <Separator className="my-6" />
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    {dir === 'rtl' ? 'المواصفات' : 'Specifications'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(dir === 'rtl' ? product.detailsAr : product.detailsEn)?.map((detail : any , index : number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{detail.title}</h4>
                        <p className="text-gray-700 text-sm">{detail.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warranty Information */}
              {(product.warrantyEn || product.warrantyAr) && (
                <div>
                  <Separator className="my-6" />
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    {dir === 'rtl' ? 'الضمان' : 'Warranty'}
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                      🛡️ {dir === 'rtl' ? product.warrantyAr : product.warrantyEn}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {dir === 'rtl' ? 'منتجات ذات صلة' : 'Related Products'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                      <div className="bg-gray-200 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              }>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.slice(0, 4).map((relatedProduct) => (
                    <ProductCard 
                      key={relatedProduct.id} 
                      product={relatedProduct} 
                      dir={dir} 
                    />
                  ))}
                </div>
              </Suspense>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
