import { Card, CardContent } from "@/components/shadcnUI/card";
import { Shield } from "lucide-react";

interface CallToActionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export function CallToAction({
  title = "Questions About Your Privacy?",
  description = "We're committed to transparency and protecting your personal information. If you have any questions about this policy, don't hesitate to reach out.",
  primaryButtonText = "Contact Us",
  secondaryButtonText = "Download PDF"
}: CallToActionProps) {
  return (
    <div className="mt-16 text-center">
      <Card className="bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-700 dark:to-amber-900 border-0 text-white max-w-4xl mx-auto">
        <CardContent className="p-8">
          <Shield className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-4">{title}</h3>
          <p className="text-lg mb-6 opacity-90">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-amber-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              {primaryButtonText}
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-amber-600 transition-colors">
              {secondaryButtonText}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
