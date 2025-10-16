import { Alert, AlertDescription } from "@/components/shadcnUI/alert";
import { AlertCircle } from "lucide-react";

interface ImportantNoticeProps {
  title?: string;
  description?: string;
}

export function ImportantNotice({
  title = "Important:",
  description = "By using our services, you agree to these terms. Please read them carefully before proceeding."
}: ImportantNoticeProps) {
  return (
    <Alert className="mb-16 border-orange-200 bg-orange-50">
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <strong>{title}</strong> {description}
      </AlertDescription>
    </Alert>
  );
}
