import { Input } from "@/components/shadcnUI/input";
import { Badge } from "@/components/shadcnUI/badge";
import { Search } from "lucide-react";

interface HeroSectionProps {
  dictionary: {
    cms: {
      faq: {
        title: string;
        subtitle: string;
        searchPlaceholder: string;
      };
    };
  };
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function HeroSection({ dictionary, searchTerm, onSearchChange }: HeroSectionProps) {
  return (
    <div className="text-center mb-16">
      <Badge variant="outline" className="mb-4 text-sm font-medium">
        {dictionary.cms.faq.subtitle}
      </Badge>
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {dictionary.cms.faq.title}
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
        Find answers to the most commonly asked questions about our services
      </p>

      {/* Search Bar */}
      <div className="max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={dictionary.cms.faq.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
