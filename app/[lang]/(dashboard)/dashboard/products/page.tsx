import { getAllProductsActions } from "@/lib/actions/products";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { type Locale } from "@/lib/i18n/i18n-config";
import { ProductsList } from "./_components/ProductsList";

export default async function ProductsPage({ 
  params, 
  searchParams 
}: { 
  params: { lang: string },
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const lang = params?.lang as Locale;
  const dictionary = await getDictionary(lang);

  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  const productsResult = await getAllProductsActions(1, 50, search);

  const products = productsResult.success ? productsResult.data : [];

  return (
    <ProductsList initialProducts={products || []} dictionary={dictionary} />
  );
}