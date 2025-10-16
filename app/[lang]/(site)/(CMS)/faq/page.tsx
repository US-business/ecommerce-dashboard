import { getDictionary } from "@/lib/i18n/get-dictionary";
import { type Locale } from "@/lib/i18n/i18n-config";
import { FAQClient } from "./_components/FAQClient";

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const resolvedParams = await params;

  const lang = resolvedParams?.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";
  
  return {
    title: `${dictionary.cms.faq.title} | E-Commerce Dashboard`,
    description: dictionary.cms.faq.subtitle,
    dir,
  };
}

export default async function FAQPage({ params }: { params: { lang: string } }) {
  const resolvedParams = await params;
  console.log("resolvedParams", resolvedParams);

  const lang = resolvedParams?.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return <FAQClient dictionary={dictionary}  />;
}