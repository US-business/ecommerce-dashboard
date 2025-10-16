import { Card, CardContent } from "@/components/shadcnUI/card";
import { Shield, Lock, Eye } from "lucide-react";

interface HighlightsSectionProps {
  highlights?: Array<{
    icon: any;
    title: string;
    description: string;
  }>;
}

export function HighlightsSection({ highlights }: HighlightsSectionProps) {
  const defaultHighlights = [
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

  const displayHighlights = highlights || defaultHighlights;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {displayHighlights.map((highlight, index) => (
        <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <highlight.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{highlight.title}</h3>
            <p className="text-sm text-muted-foreground">{highlight.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
