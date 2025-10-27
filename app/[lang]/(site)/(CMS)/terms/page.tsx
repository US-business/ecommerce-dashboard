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

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;

  const lang = resolvedParams?.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";
  
  return {
    title: `${dictionary.cms.terms.title} | E-Commerce Dashboard`,
    description: dictionary.cms.terms.subtitle,
    dir,
  };
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  const sections = [
    {
      key: 'acceptance',
      icon: AlertCircle,
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
    {
      key: 'services',
      icon: FileText,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500",
    },
    {
      key: 'account',
      icon: User,
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
    {
      key: 'prohibited',
      icon: Ban,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500",
    },
    {
      key: 'intellectual',
      icon: Copyright,
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
    {
      key: 'limitation',
      icon: Shield,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500",
    },
    {
      key: 'modifications',
      icon: Calendar,
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
  ];

  const keyPoints = [
    {
      icon: Scale,
      title: dictionary.cms.terms.keyPoints.legalAgreement.title,
      description: dictionary.cms.terms.keyPoints.legalAgreement.description,
    },
    {
      icon: Shield,
      title: dictionary.cms.terms.keyPoints.userProtection.title,
      description: dictionary.cms.terms.keyPoints.userProtection.description,
    },
    {
      icon: FileText,
      title: dictionary.cms.terms.keyPoints.clearGuidelines.title,
      description: dictionary.cms.terms.keyPoints.clearGuidelines.description,
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