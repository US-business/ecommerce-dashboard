import { Badge } from "@/components/shadcnUI/badge";
import { Calendar } from "lucide-react";

interface HeroSectionProps {
  dictionary: {
    cms: {
      terms: {
        title: string;
        subtitle: string;
        lastUpdated: string;
      };
    };
  };
}

export function HeroSection({ dictionary }: HeroSectionProps) {
  return (
    <div className="text-center mb-16">
      <Badge variant="outline" className="mb-4 text-sm font-medium">
        <Calendar className="h-3 w-3 mr-1" />
        {dictionary.cms.terms.lastUpdated}
      </Badge>
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-500 dark:to-amber-700 bg-clip-text text-transparent">
        {dictionary.cms.terms.title}
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        {dictionary.cms.terms.subtitle}
      </p>
    </div>
  );
}
