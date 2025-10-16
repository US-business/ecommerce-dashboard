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

export async function generateMetadata({ params }: { params: { lang: string } }) {
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

export default async function PrivacyPage({ params }: { params: { lang: string } }) {

  const resolvedParams = await params;
  const lang = resolvedParams?.lang as Locale;
  const dictionary = await getDictionary(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";

  const sections = [
    {
      key: 'introduction',
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      key: 'collection',
      icon: Database,
      color: "bg-green-100 text-green-600",
    },
    {
      key: 'usage',
      icon: Eye,
      color: "bg-purple-100 text-purple-600",
    },
    {
      key: 'sharing',
      icon: Users,
      color: "bg-orange-100 text-orange-600",
    },
    {
      key: 'security',
      icon: Shield,
      color: "bg-red-100 text-red-600",
    },
    {
      key: 'rights',
      icon: Lock,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      key: 'contact',
      icon: Phone,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const highlights = [
    {
      icon: Shield,
      title: "Data Protection",
      description: "We implement industry-standard security measures to protect your information",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Your privacy is our priority and we never sell your personal data",
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "We're transparent about what data we collect and how we use it",
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