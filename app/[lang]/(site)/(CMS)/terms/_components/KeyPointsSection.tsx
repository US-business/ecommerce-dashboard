import { Card, CardContent } from "@/components/shadcnUI/card";
import { Scale, Shield, FileText } from "lucide-react";

interface KeyPointsSectionProps {
  keyPoints?: Array<{
    icon: any;
    title: string;
    description: string;
  }>;
}

export function KeyPointsSection({ keyPoints }: KeyPointsSectionProps) {
  const defaultKeyPoints = [
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

  const displayKeyPoints = keyPoints || defaultKeyPoints;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {displayKeyPoints.map((point, index) => (
        <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <point.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{point.title}</h3>
            <p className="text-sm text-muted-foreground">{point.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
