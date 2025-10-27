import { Badge } from "@/components/shadcnUI/badge";

interface HeroSectionProps {
  dictionary: {
    cms: {
      about: {
        subtitle: string;
        hero: {
          title: string;
          description: string;
        };
      };
    };
  };
  dir: string;
}

export function HeroSection({ dictionary, dir }: HeroSectionProps) {
  return (
    <div className="text-center mb-16">
      <Badge variant="outline" className="mb-4 text-sm font-medium">
        {dictionary.cms.about.subtitle}
      </Badge>
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-500 dark:to-amber-700 bg-clip-text text-transparent">
        {dictionary.cms.about.hero.title}
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        {dictionary.cms.about.hero.description}
      </p>
    </div>
  );
}

export default HeroSection;
