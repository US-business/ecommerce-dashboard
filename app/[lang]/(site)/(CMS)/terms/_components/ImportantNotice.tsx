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
    <Alert className="mb-16 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
      <AlertDescription className="text-amber-800 dark:text-amber-400">
        <strong>{title}</strong> {description}
      </AlertDescription>
    </Alert>
  );
}
