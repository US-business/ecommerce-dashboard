import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Scale, FileText, Shield, User, AlertCircle, Copyright, Ban, Calendar } from "lucide-react";

interface TermsSectionsProps {
  dictionary: {
    cms: {
      terms: {
        sections: {
          acceptance: { title: string; content: string };
          services: { title: string; content: string };
          account: { title: string; content: string };
          prohibited: { title: string; content: string };
          intellectual: { title: string; content: string };
          limitation: { title: string; content: string };
          modifications: { title: string; content: string };
        };
      };
    };
  };
  sections?: Array<{
    key: string;
    icon: any;
    color: string;
  }>;
}

export function TermsSections({ dictionary, sections }: TermsSectionsProps) {
  const defaultSections = [
    {
      key: 'acceptance',
      icon: AlertCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      key: 'services',
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      key: 'account',
      icon: User,
      color: "bg-purple-100 text-purple-600",
    },
    {
      key: 'prohibited',
      icon: Ban,
      color: "bg-red-100 text-red-600",
    },
    {
      key: 'intellectual',
      icon: Copyright,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      key: 'limitation',
      icon: Shield,
      color: "bg-orange-100 text-orange-600",
    },
    {
      key: 'modifications',
      icon: Calendar,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const displaySections = sections || defaultSections;

  const getSectionContent = (sectionKey: string) => {
    const section = dictionary.cms.terms.sections[sectionKey as keyof typeof dictionary.cms.terms.sections];
    return section;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8">
        {displaySections.map((section, index) => {
          const sectionData = getSectionContent(section.key);

          return (
            <Card key={section.key} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.color}`}>
                    <section.icon className="h-5 w-5" />
                  </div>
                  {sectionData.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {sectionData.content}
                  </p>

                  {/* Additional content for specific sections */}
                  {section.key === 'prohibited' && (
                    <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-2">Prohibited Activities Include:</h4>
                      <ul className="list-disc list-inside text-red-800 space-y-1">
                        <li>Violating any applicable laws or regulations</li>
                        <li>Infringing on intellectual property rights</li>
                        <li>Transmitting harmful or malicious code</li>
                        <li>Engaging in fraudulent activities</li>
                        <li>Harassing or threatening other users</li>
                        <li>Unauthorized data collection or scraping</li>
                      </ul>
                    </div>
                  )}

                  {section.key === 'account' && (
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Account Responsibilities:</h4>
                      <ul className="list-disc list-inside text-purple-800 space-y-1">
                        <li>Provide accurate and complete information</li>
                        <li>Keep your login credentials secure</li>
                        <li>Notify us of unauthorized account access</li>
                        <li>Update your information when necessary</li>
                        <li>Comply with our community guidelines</li>
                      </ul>
                    </div>
                  )}

                  {section.key === 'intellectual' && (
                    <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2">Protected Materials Include:</h4>
                      <ul className="list-disc list-inside text-indigo-800 space-y-1">
                        <li>Website design and layout</li>
                        <li>Logos, trademarks, and brand assets</li>
                        <li>Software code and algorithms</li>
                        <li>Content, text, and images</li>
                        <li>Product descriptions and specifications</li>
                      </ul>
                    </div>
                  )}

                  {section.key === 'limitation' && (
                    <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Limitation Scope:</h4>
                      <ul className="list-disc list-inside text-orange-800 space-y-1">
                        <li>Direct, indirect, or consequential damages</li>
                        <li>Loss of profits or business opportunities</li>
                        <li>Data loss or corruption</li>
                        <li>Service interruptions or downtime</li>
                        <li>Third-party actions or omissions</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
