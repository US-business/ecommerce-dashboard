import { Card, CardContent } from "@/components/shadcnUI/card";
import { FileText, Users, Phone } from "lucide-react";

interface AdditionalResourcesProps {
  resources?: Array<{
    icon: any;
    title: string;
    description: string;
    href?: string;
  }>;
}

export function AdditionalResources({ resources }: AdditionalResourcesProps) {
  const defaultResources = [
    {
      icon: FileText,
      title: "Cookie Policy",
      description: "Learn about our use of cookies",
    },
    {
      icon: Users,
      title: "Terms of Service",
      description: "Read our terms and conditions",
    },
    {
      icon: Phone,
      title: "Data Protection Officer",
      description: "Contact our DPO directly",
    },
  ];

  const displayResources = resources || defaultResources;

  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      {displayResources.map((resource, index) => (
        <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <resource.icon className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{resource.title}</h3>
            <p className="text-sm text-muted-foreground">{resource.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
