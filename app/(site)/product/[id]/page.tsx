import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/shadcnUI/breadcrumb";
import BackLink from "@/components/ui/BackLink";
import { getProduct } from "@/lib/actions/products";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { ProductProps } from "@/types/product"
import ImageItem from "@/components/ui/ImageItem";
import InfoItem from "@/components/ui/InfoItem";

export async function generateMetadata({ params }: any): Promise<Metadata> {
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



export default async function ProductPage({ params }: { params: { id: string } }) {

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


  return (
    <div className="container mx-auto">

      <BackLink dir={dir} className="my-4" />

      {/* Breadcrumbs */}
      <Breadcrumb className="my-4 mx-auto text-md bg-white rounded-lg py-2 px-4 shadow-sm">
        <BreadcrumbList className="flex items-center justify-center" role="list">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{<Home className="h-4 w-4" />}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className={cn(`${dir === "rtl" ? "rotate-180" : ""}`)} />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/category/${product?.category?.slug}`}>{dir === "rtl" ? product?.category.nameAr : product?.category.nameEn}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className={cn(`${dir === "rtl" ? "rotate-180" : ""}`)} />
          <BreadcrumbItem>
            <BreadcrumbPage>{dir === "rtl" ? product.nameAr : product.nameEn}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid lg:grid-cols-2 gap-12 my-4">
        {/* Product Images */}
        <ImageItem product={product} dir={dir} />
        {/* Product Info */}
        <InfoItem product={product} dir={dir} />
      </div>








      <h1>{product.nameEn}</h1>
      <p>{product.nameAr}</p>
      <strong>{product.price} جنيه</strong>
    </div>
  );
}
