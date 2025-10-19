import { getAllProductsActions } from "@/lib/actions/products";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { type Locale } from "@/lib/i18n/i18n-config";
import { ProductsList } from "./_components/ProductsList";
import { Suspense } from "react";
import { ProductsTableSkeleton } from "@/components/ui/skeletons/ProductsTableSkeleton";
import { Card, CardContent } from "@/components/shadcnUI/card";
import { AlertCircle } from "lucide-react";

export default async function ProductsPage({params,searchParams}: {params: Promise<{ lang: string }>,searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const lang = resolvedParams?.lang as Locale;
  const dictionary = await getDictionary(lang);

  // Extract search params
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page) : 1;
  const limit = typeof resolvedSearchParams.limit === 'string' ? parseInt(resolvedSearchParams.limit) : 20;
  const sortBy = typeof resolvedSearchParams.sortBy === 'string' ? resolvedSearchParams.sortBy : 'createdAt';
  const sortOrder = typeof resolvedSearchParams.sortOrder === 'string' ? resolvedSearchParams.sortOrder : 'desc';

  // Fetch products with error handling
  const productsResult = await getAllProductsActions(page, limit, search);

  // Error state
  if (!productsResult.success) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">
                  {lang === 'ar' ? 'خطأ في تحميل المنتجات' : 'Error Loading Products'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {productsResult.error || (lang === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const products = productsResult.data || [];
  const total = productsResult.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <Suspense fallback={<ProductsTableSkeleton />}>
      <ProductsList 
        initialProducts={products} 
        dictionary={dictionary}
        currentPage={page}
        totalPages={totalPages}
        totalProducts={total}
        limit={limit}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </Suspense>
  );
}