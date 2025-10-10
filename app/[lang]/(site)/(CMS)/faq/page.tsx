import { getDictionary } from "@/lib/i18n/get-dictionary";
import { type Locale } from "@/lib/i18n/i18n-config";
import { FAQClient } from "./_components/FAQClient";

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params?.lang as Locale;
  const dictionary = await getDictionary(lang);
  
  return {
    title: `${dictionary.cms.faq.title} | E-Commerce Dashboard`,
    description: dictionary.cms.faq.subtitle,
  };
}

export default async function FAQPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);

  return <FAQClient dictionary={dictionary} />;
}