import { getProductsByCategorySlug } from "@/lib/actions/products";
import { cookies } from "next/headers";
import { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/shadcnUI/breadcrumb"; 
import { FilterSidebar } from "@/components/layout/FilterSidebar";
import { FilteredProducts } from "@/components/layout/FilteredProducts";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const categorySlug = resolvedParams?.slug;

  if (!categorySlug) {
    return { title: 'Category Not Found' };
  }

  const cookieStore = await cookies();
  const locale = cookieStore.get("preferred-locale")?.value || "ar"; // default ar
  const dir = locale === "ar" ? "rtl" : "ltr";

  const { data: productInCategory } = await getProductsByCategorySlug(categorySlug);


  if (!productInCategory) {
    return { title: 'Category Not Found | Dubai-Trading' };
  }

  const categoryName = dir === 'rtl' ? productInCategory[0].category?.nameAr : productInCategory[0].category?.nameEn || 'Category';
  const description = `Browse products in the ${categoryName} category. Find the best deals at Dubai-Trading.`;

  return {
    title: dir === 'rtl' ? ` Dubai-Trading | ${categoryName} ` : `${categoryName} | Dubai-Trading`,
    description: description,
  };
}








export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.slug;

  const cookieStore = await cookies();
  const locale = cookieStore.get("preferred-locale")?.value || "ar"; // default ar
  const dir = locale === "ar" ? "rtl" : "ltr";

  const productsRes = await getProductsByCategorySlug(categorySlug);


  if (!categorySlug) {
    return <p className="text-center">Category slug is missing.</p>;
  }


  if (!productsRes.success || !productsRes.data?.length) {
    return (
      <>
        {dir === 'rtl' ?
          <h1 className="text-center">المنتجات غير متاحة</h1>
          :
          <h1 className="text-center">Products Not Available</h1>
        }
      </>
    ); 
  }
 
  // Extract unique brands from products
  const brands = [...new Set(productsRes.data.map((p: any) => p.brand).filter(Boolean))];

  return (
    <main className="container mx-auto ">
      {/* Breadcrumbs */}
      <Breadcrumb className="my-9 mx-auto text-md bg-white rounded-lg py-2 px-4 shadow-sm">
        <BreadcrumbList className="flex items-center justify-center" role="list">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{<Home className="h-4 w-4" />}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className={cn(`${dir === "rtl" ? "rotate-180" : ""}`)}/>
          <BreadcrumbItem>
            <BreadcrumbPage>{dir === "rtl" ? productsRes.data[0].category.nameAr : productsRes.data[0].category.nameEn || "Category"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Filter Sidebar */}
        <FilterSidebar brands={brands} dir={dir} />

        {/* Filtered Products */}
        <FilteredProducts
          initialProducts={productsRes.data}
          categorySlug={categorySlug}
        />
      </div>
    </main> 
  );
}
