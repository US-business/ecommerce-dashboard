import { Card, CardContent } from "@/components/shadcnUI/card";

interface CallToActionSectionProps {
  dictionary: {
    cms: {
      about: {
        cta: {
          title: string;
          description: string;
          primaryButton: string;
          secondaryButton: string;
        };
      };
    };
  };
}

export function CallToActionSection({ dictionary }: CallToActionSectionProps) {
  return (
    <div className="text-center">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold mb-4">{dictionary.cms.about.cta.title}</h3>
          <p className="text-lg mb-6 opacity-90">
            {dictionary.cms.about.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              {dictionary.cms.about.cta.primaryButton}
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
              {dictionary.cms.about.cta.secondaryButton}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CallToActionSection;
