import { getDictionary } from "@/lib/i18n/get-dictionary";
import { type Locale } from "@/lib/i18n/i18n-config";
import { Separator } from "@/components/shadcnUI/separator";
import {
  Shield,
  Eye,
  Lock,
  Users,
  Database,
  FileText,
  Phone,
  Calendar
} from "lucide-react";
import { HeroSection } from "./_components/HeroSection";
import { HighlightsSection } from "./_components/HighlightsSection";
import { PrivacySections } from "./_components/PrivacySections";
import { CallToAction } from "./_components/CallToAction";
import { AdditionalResources } from "./_components/AdditionalResources";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;

  const lang = resolvedParams?.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";
  
  return {
    title: `${dictionary.cms.privacy.title} | E-Commerce Dashboard`,
    description: dictionary.cms.privacy.subtitle,
    dir,
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  const sections = [
    {
      key: 'introduction',
      icon: FileText,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500",
    },
    {
      key: 'collection',
      icon: Database,
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
    {
      key: 'usage',
      icon: Eye,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500",
    },
    {
      key: 'sharing',
      icon: Users,
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
    {
      key: 'security',
      icon: Shield,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500",
    },
    {
      key: 'rights',
      icon: Lock,
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
    {
      key: 'contact',
      icon: Phone,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500",
    },
  ];

  const highlights = [
    {
      icon: Shield,
      title: dictionary.cms.privacy.highlights.dataProtection.title,
      description: dictionary.cms.privacy.highlights.dataProtection.description, 
    },
    {
      icon: Lock,
      title: dictionary.cms.privacy.highlights.privacyFirst.title,
      description: dictionary.cms.privacy.highlights.privacyFirst.description,
    },
    {
      icon: Eye,
      title: dictionary.cms.privacy.highlights.transparency.title,
      description: dictionary.cms.privacy.highlights.transparency.description,
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <HeroSection dictionary={dictionary} />

      <HighlightsSection highlights={highlights} />

      <Separator className="mb-16" />

      <PrivacySections dictionary={dictionary} sections={sections} />

      <CallToAction />

      <AdditionalResources />
    </div>
  );
}