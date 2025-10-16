import { Card, CardContent } from "@/components/shadcnUI/card";
import { Rocket, Award, Heart } from "lucide-react";

interface ValuesSectionProps {
  dictionary: {
    cms: {
      about: {
        values: {
          title: string;
          innovation: {
            title: string;
            description: string;
          };
          quality: {
            title: string;
            description: string;
          };
          customer: {
            title: string;
            description: string;
          };
        };
      };
    };
  };
}

export function ValuesSection({ dictionary }: ValuesSectionProps) {
  const values = [
    {
      icon: Rocket,
      title: dictionary.cms.about.values.innovation.title,
      description: dictionary.cms.about.values.innovation.description,
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Award,
      title: dictionary.cms.about.values.quality.title,
      description: dictionary.cms.about.values.quality.description,
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Heart,
      title: dictionary.cms.about.values.customer.title,
      description: dictionary.cms.about.values.customer.description,
      color: "bg-rose-100 text-rose-600",
    },
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{dictionary.cms.about.values.title}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our core values guide everything we do and drive our commitment to excellence
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((value, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardContent className="p-8 text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${value.color}`}>
                <value.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ValuesSection;
