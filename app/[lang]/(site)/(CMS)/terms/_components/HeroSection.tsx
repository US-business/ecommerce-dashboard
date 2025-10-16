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
        {dictionary.cms.terms.lastUpdated}: January 15, 2024
      </Badge>
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {dictionary.cms.terms.title}
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        {dictionary.cms.terms.subtitle}
      </p>
    </div>
  );
}
