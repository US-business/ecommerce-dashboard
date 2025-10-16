import { getDictionary } from "@/lib/i18n/get-dictionary";
import { type Locale } from "@/lib/i18n/i18n-config";
import { Separator } from "@/components/shadcnUI/separator";
import FeaturesSection from "@/components/ui/FeaturesSection";
import {
  HeroSection,
  StatsSection,
  MissionSection,
  ValuesSection,
  TeamSection,
  CallToActionSection
} from "./_components/index";

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const resolvedParams = await params;

  const lang = resolvedParams?.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return {
    title: `${dictionary.cms.about.title} | E-Commerce Dashboard`,
    description: dictionary.cms.about.subtitle,
    dir,
  };
}

export default async function AboutPage({ params }: { params: { lang: string } }) {
  const resolvedParams = await params;

  const lang = resolvedParams?.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <div className="container mx-auto py-10 px-4">
      <HeroSection dictionary={dictionary} dir={dir} />

      <StatsSection dictionary={dictionary} />

      <FeaturesSection dir={dir} />

      <Separator className="mb-16" />

      <MissionSection dictionary={dictionary} dir={dir} />

      <ValuesSection dictionary={dictionary} />

      <Separator className="mb-16" />

      <TeamSection dictionary={dictionary} />

      <CallToActionSection dictionary={dictionary} />
    </div>
  );
}