import { getAllProductsActions } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { cookies } from "next/headers";
import { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/shadcnUI/breadcrumb";
import { FilterSidebar } from "@/components/layout/FilterSidebar";
import { FilteredProducts } from "@/components/layout/FilteredProducts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Badge } from "@/components/shadcnUI/badge";
import { Home, Package, Filter, Grid3X3, List, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { ProductsPageSkeleton } from "@/components/ui/skeletons/ProductsPageSkeleton";

export async function generateMetadata(): Promise<Metadata> {
   const cookieStore = await cookies();
   const locale = cookieStore.get("preferred-locale")?.value || "ar";
   const dir = locale === "ar" ? "rtl" : "ltr";

   return {
      title: dir === 'rtl' ? 'جميع المنتجات | Dubai-Trading' : 'All Products | Dubai-Trading',
      description: dir === 'rtl'
         ? 'تصفح جميع منتجاتنا المتنوعة. اكتشف أفضل العروض والمنتجات الجديدة في Dubai-Trading'
         : 'Browse all our diverse products. Discover the best deals and new products at Dubai-Trading',
      keywords: dir === 'rtl'
         ? 'منتجات, تسوق, عروض, Dubai-Trading'
         : 'products, shopping, deals, Dubai-Trading',
      openGraph: {
         title: dir === 'rtl' ? 'جميع المنتجات | Dubai-Trading' : 'All Products | Dubai-Trading',
         description: dir === 'rtl'
            ? 'تصفح جميع منتجاتنا المتنوعة'
            : 'Browse all our diverse products',
         type: 'website',
      },
   };
}

interface ProductsPageProps {
   searchParams: {
      page?: string;
      limit?: string;
      search?: string;
      category?: string;
      brand?: string;
      minPrice?: string;
      maxPrice?: string;
      sort?: string;
   };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
   const cookieStore = await cookies();
   const locale = cookieStore.get("preferred-locale")?.value || "ar";
   const dir = locale === "ar" ? "rtl" : "ltr";

   // Parse search parameters
   const page = parseInt(searchParams.page || '1');
   const limit = parseInt(searchParams.limit || '20');
   const search = searchParams.search;
   const categoryId = searchParams.category ? parseInt(searchParams.category) : undefined;

   // Fetch data
   const [productsRes, categoriesRes] = await Promise.all([
      getAllProductsActions(page, limit, search, false, categoryId),
      getCategories(),
   ]);

   const products = productsRes.success ? (productsRes.data || []) : [];
   const categories = categoriesRes.success ? (categoriesRes.data || []) : [];
   const totalProducts = productsRes.success ? (productsRes.total || 0) : 0;

   // Extract unique brands from products
   const brands = [...new Set(products.map((p: any) => p.brand).filter(Boolean))];

   return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
         <div className="container mx-auto px-4 py-6">
            {/* Header Section */}
            <div className="mb-8">

               {/* Breadcrumbs */}
               <Breadcrumb className="mb-6">
                  <BreadcrumbList className="flex items-center" role="list">
                     <BreadcrumbItem>
                        <BreadcrumbLink href="/" className="flex items-center gap-2 hover:text-primary transition-colors">
                           <Home className="h-4 w-4" />
                           {dir === 'rtl' ? 'الرئيسية' : 'Home'}
                        </BreadcrumbLink>
                     </BreadcrumbItem>
                     <BreadcrumbSeparator className={cn(dir === "rtl" ? "rotate-180" : "")} />
                     <BreadcrumbItem>
                        <BreadcrumbPage className="flex items-center gap-2">
                           <Package className="h-4 w-4" />
                           {dir === 'rtl' ? 'جميع المنتجات' : 'All Products'}
                        </BreadcrumbPage>
                     </BreadcrumbItem>
                  </BreadcrumbList>
               </Breadcrumb>

               {/* Page Header */}
               <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                  <CardHeader className="text-center">
                     <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
                        <Package className="w-8 h-8 text-primary" />
                        {dir === 'rtl' ? 'جميع المنتجات' : 'All Products'}
                     </CardTitle>
                     <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {dir === 'rtl'
                           ? 'اكتشف مجموعتنا الواسعة من المنتجات عالية الجودة بأفضل الأسعار'
                           : 'Discover our wide range of high-quality products at the best prices'
                        }
                     </CardDescription>

                     {/* Stats */}
                     <div className="flex items-center justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                           <Badge variant="secondary" className="text-sm">
                              {totalProducts} {dir === 'rtl' ? 'منتج' : 'Products'}
                           </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className="text-sm">
                              {categories.length} {dir === 'rtl' ? 'فئة' : 'Categories'}
                           </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className="text-sm">
                              {brands.length} {dir === 'rtl' ? 'علامة تجارية' : 'Brands'}
                           </Badge>
                        </div>
                     </div>
                  </CardHeader>
               </Card>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
               {/* Filter Sidebar */}
               <FilterSidebar
                  brands={brands}
                  categories={categories}
                  dir={dir}
                  showPriceRange={true}
                  showBrands={true}
               />


               {/* Products Grid */}
               <div className="flex-1">
                  <Suspense fallback={<ProductsPageSkeleton />}>
                     {products.length > 0 ? (
                        <FilteredProducts
                           initialProducts={products}
                           totalProducts={totalProducts}
                           currentPage={page}
                           limit={limit}
                           dir={dir}
                           showSorting={true}
                           showViewToggle={true}
                           showPagination={true}
                        />
                     ) : (
                        <Card className="text-center py-12">
                           <CardContent>
                              <div className="flex flex-col items-center gap-4">
                                 <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Search className="w-12 h-12 text-gray-400" />
                                 </div>
                                 <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                       {dir === 'rtl' ? 'لا توجد منتجات' : 'No Products Found'}

                                    </h3>
                                    <p className="text-gray-600">
                                       {dir === 'rtl'
                                          ? 'لم نتمكن من العثور على أي منتجات. جرب تغيير معايير البحث.'
                                          : 'We couldn\'t find any products. Try adjusting your search criteria.'
                                       }
                                    </p>
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     )}
                  </Suspense>
               </div>
            </div>

            {/* Additional Information Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="text-center">
                  <CardContent className="pt-6">
                     <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-6 h-6 text-primary" />
                     </div>
                     <h3 className="font-semibold text-gray-900 mb-2">
                        {dir === 'rtl' ? 'منتجات عالية الجودة' : 'High Quality Products'}
                     </h3>
                     <p className="text-sm text-gray-600">
                        {dir === 'rtl'
                           ? 'نقدم فقط أفضل المنتجات من علامات تجارية موثوقة'
                           : 'We offer only the best products from trusted brands'
                        }
                     </p>
                  </CardContent>
               </Card>

               <Card className="text-center">
                  <CardContent className="pt-6">
                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Grid3X3 className="w-6 h-6 text-green-600" />
                     </div>
                     <h3 className="font-semibold text-gray-900 mb-2">
                        {dir === 'rtl' ? 'تنوع كبير' : 'Wide Variety'}
                     </h3>
                     <p className="text-sm text-gray-600">
                        {dir === 'rtl'
                           ? 'مجموعة واسعة من المنتجات لتلبية جميع احتياجاتك'
                           : 'A wide range of products to meet all your needs'
                        }
                     </p>
                  </CardContent>
               </Card>

               <Card className="text-center">
                  <CardContent className="pt-6">
                     <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <List className="w-6 h-6 text-blue-600" />
                     </div>
                     <h3 className="font-semibold text-gray-900 mb-2">
                        {dir === 'rtl' ? 'سهولة التصفح' : 'Easy Browsing'}
                     </h3>
                     <p className="text-sm text-gray-600">
                        {dir === 'rtl'
                           ? 'واجهة سهلة الاستخدام مع فلاتر متقدمة للبحث'
                           : 'User-friendly interface with advanced search filters'
                        }
                     </p>
                  </CardContent>
               </Card>
            </div>
         </div>
      </main>
   );
}