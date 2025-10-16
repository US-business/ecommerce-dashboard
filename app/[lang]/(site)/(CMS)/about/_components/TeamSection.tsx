import { Card, CardContent } from "@/components/shadcnUI/card";
import { Users } from "lucide-react";

interface TeamSectionProps {
  dictionary: {
    cms: {
      about: {
        team: {
          title: string;
          description: string;
        };
      };
    };
  };
}

export function TeamSection({ dictionary }: TeamSectionProps) {
  const teamMembers = [
    {
      name: "Ahmed Al-Rashid",
      role: "CEO & Founder",
      image: "/team/ceo.jpg",
      description: "Visionary leader with 10+ years in e-commerce"
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      image: "/team/cto.jpg",
      description: "Tech innovator specializing in scalable platforms"
    },
    {
      name: "Mohammed Hassan",
      role: "Head of Design",
      image: "/team/designer.jpg",
      description: "Creative director with expertise in UX/UI"
    },
    {
      name: "Lisa Chen",
      role: "Marketing Director",
      image: "/team/marketing.jpg",
      description: "Growth strategist and brand development expert"
    },
  ];

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{dictionary.cms.about.team.title}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {dictionary.cms.about.team.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="h-12 w-12 text-primary/60" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
              <p className="text-primary font-medium mb-3">{member.role}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {member.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default TeamSection;
