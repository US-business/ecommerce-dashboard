"use client";

import { useState, useMemo } from "react";
import { Separator } from "@/components/shadcnUI/separator";
import { HelpCircle, Package, CreditCard, RefreshCw, Settings, MessageSquare, Phone, Mail } from "lucide-react";
import { HeroSection } from "./HeroSection";
import { StatsSection } from "./StatsSection";
import { CategorySidebar } from "./CategorySidebar";
import { FAQContent } from "./FAQContent";
import { SupportChannels } from "./SupportChannels";
import { CallToAction } from "./CallToAction";

interface FAQClientProps {
  dictionary: any;
}

export function FAQClient({ dictionary }: FAQClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("general");

  const categoryIcons = {
    general: Settings,
    orders: Package,
    payments: CreditCard,
    returns: RefreshCw,
    technical: MessageSquare,
  };

  const categoryColors = {
    general: "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500",
    orders: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    payments: "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500",
    returns: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    technical: "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500",
  };

  // Filter questions based on search term
  const filteredQuestions = useMemo(() => {
    if (!searchTerm) return dictionary.cms.faq.questions[activeCategory];

    const allQuestions = Object.values(dictionary.cms.faq.questions).flat() as Array<{
      question: string;
      answer: string;
    }>;

    return allQuestions.filter((item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, activeCategory, dictionary.cms.faq.questions]);

  const stats = [
    { label: "Total Questions", value: "50+", icon: HelpCircle },
    { label: "Categories", value: "5", icon: Settings },
    { label: "Average Response", value: "< 24h", icon: MessageSquare },
    { label: "Satisfaction Rate", value: "98%", icon: Package },
  ];

  const supportChannels = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      action: "Call Now",
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your questions via email",
      action: "Send Email",
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
      color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <HeroSection
        dictionary={dictionary}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <StatsSection stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <CategorySidebar
          dictionary={dictionary}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchTerm={searchTerm}
        />

        <FAQContent
          dictionary={dictionary}
          activeCategory={activeCategory}
          searchTerm={searchTerm}
          filteredQuestions={filteredQuestions}
          onSearchClear={() => setSearchTerm("")}
        />
      </div>

      <Separator className="my-16" />

      <SupportChannels supportChannels={supportChannels} />

      <CallToAction />
    </div>
  );
}