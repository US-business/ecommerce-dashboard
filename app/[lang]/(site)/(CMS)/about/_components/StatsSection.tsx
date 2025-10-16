import { Card, CardContent } from "@/components/shadcnUI/card";
import { Users, TrendingUp, Star, Shield } from "lucide-react";

interface StatsSectionProps {
  dictionary: {
    cms: {
      about: {
        stats: {
          happyCustomers: string;
          yearsExperience: string;
          productsSold: string;
          successRate: string;
        };
      };
    };
  };
}

export function StatsSection({ dictionary }: StatsSectionProps) {
  const stats = [
    { label: dictionary.cms.about.stats.happyCustomers, value: "10,000+", icon: Users },
    { label: dictionary.cms.about.stats.yearsExperience, value: "5+", icon: TrendingUp },
    { label: dictionary.cms.about.stats.productsSold, value: "50,000+", icon: Star },
    { label: dictionary.cms.about.stats.successRate, value: "99%", icon: Shield },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
      {stats.map((stat, index) => (
        <Card key={index} className="text-center">
          <CardContent className="p-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default StatsSection;
