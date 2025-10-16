import { Card, CardContent } from "@/components/shadcnUI/card";
import { Target } from "lucide-react";

interface MissionSectionProps {
  dictionary: {
    cms: {
      about: {
        mission: {
          title: string;
          description: string;
        };
      };
    };
  };
  dir: string;
}

export function MissionSection({ dictionary, dir }: MissionSectionProps) {
  return (
    <div className="mb-16">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 md:p-12">
          <div className={`flex flex-col md:flex-row items-center gap-8 ${dir === "rtl" ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">{dictionary.cms.about.mission.title}</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {dictionary.cms.about.mission.description}
              </p>
            </div>
            <div className="flex-1">
              <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <Target className="h-24 w-24 text-primary/30" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MissionSection;
