import { getDictionary } from "@/lib/i18n/get-dictionary";
import { type Locale } from "@/lib/i18n/i18n-config";
import { Separator } from "@/components/shadcnUI/separator";
import {
  FileText,
  Scale,
  Shield,
  User,
  AlertCircle,
  Copyright,
  Ban,
  Calendar
} from "lucide-react";
import { HeroSection } from "./_components/HeroSection";
import { ImportantNotice } from "./_components/ImportantNotice";
import { KeyPointsSection } from "./_components/KeyPointsSection";
import { TermsSections } from "./_components/TermsSections";
import { GoverningLawSection } from "./_components/GoverningLawSection";
import { ContactInformation } from "./_components/ContactInformation";
import { AdditionalResources } from "./_components/AdditionalResources";

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const resolvedParams = await params;
  console.log("resolvedParams", resolvedParams);

  const lang = resolvedParams?.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";
  
  return {
    title: `${dictionary.cms.terms.title} | E-Commerce Dashboard`,
    description: dictionary.cms.terms.subtitle,
    dir,
  };
}

export default async function TermsPage({ params }: { params: { lang: string } }) {
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  const sections = [
    {
      key: 'acceptance',
      icon: AlertCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      key: 'services',
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      key: 'account',
      icon: User,
      color: "bg-purple-100 text-purple-600",
    },
    {
      key: 'prohibited',
      icon: Ban,
      color: "bg-red-100 text-red-600",
    },
    {
      key: 'intellectual',
      icon: Copyright,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      key: 'limitation',
      icon: Shield,
      color: "bg-orange-100 text-orange-600",
    },
    {
      key: 'modifications',
      icon: Calendar,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const keyPoints = [
    {
      icon: Scale,
      title: "Legal Agreement",
      description: "These terms constitute a legally binding agreement between you and us",
    },
    {
      icon: Shield,
      title: "User Protection",
      description: "We're committed to providing a safe and secure platform for all users",
    },
    {
      icon: FileText,
      title: "Clear Guidelines",
      description: "Our terms provide clear guidelines on acceptable use of our services",
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <HeroSection dictionary={dictionary} />

      <ImportantNotice />

      <KeyPointsSection keyPoints={keyPoints} />

      <Separator className="mb-16" />

      <TermsSections dictionary={dictionary} sections={sections} />

      <GoverningLawSection />

      <ContactInformation />

      <AdditionalResources />
    </div>
  );
}