import { Card, CardContent } from "@/components/shadcnUI/card";
import { Button } from "@/components/shadcnUI/button";
import { HelpCircle, MessageSquare, Mail } from "lucide-react";

interface CallToActionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export function CallToAction({
  title = "Didn't Find Your Answer?",
  description = "Our dedicated support team is ready to help you with any questions or concerns",
  primaryButtonText = "Contact Support",
  secondaryButtonText = "Submit Ticket"
}: CallToActionProps) {
  return (
    <div className="text-center">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
        <CardContent className="p-8">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-4">{title}</h3>
          <p className="text-lg mb-6 opacity-90">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              <MessageSquare className="h-4 w-4 mr-2" />
              {primaryButtonText}
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Mail className="h-4 w-4 mr-2" />
              {secondaryButtonText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
