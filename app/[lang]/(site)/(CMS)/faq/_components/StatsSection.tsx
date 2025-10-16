import { Card, CardContent } from "@/components/shadcnUI/card";
import { HelpCircle, Settings, MessageSquare, Package } from "lucide-react";

interface StatsSectionProps {
  stats?: Array<{
    label: string;
    value: string;
    icon: any;
  }>;
}

export function StatsSection({ stats }: StatsSectionProps) {
  const defaultStats = [
    { label: "Total Questions", value: "50+", icon: HelpCircle },
    { label: "Categories", value: "5", icon: Settings },
    { label: "Average Response", value: "< 24h", icon: MessageSquare },
    { label: "Satisfaction Rate", value: "98%", icon: Package },
  ];

  const displayStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
      {displayStats.map((stat, index) => (
        <Card key={index} className="text-center border-0 shadow-md">
          <CardContent className="p-4">
            <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-lg font-bold mb-1">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
