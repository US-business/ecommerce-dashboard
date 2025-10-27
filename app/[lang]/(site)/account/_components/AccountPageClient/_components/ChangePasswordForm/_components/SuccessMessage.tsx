import { Button } from "@/components/shadcnUI/button";
import { Card, CardContent } from "@/components/shadcnUI/card";
import { CheckCircle } from "lucide-react";

interface SuccessMessageProps {
  dir: "rtl" | "ltr";
  onCancel?: () => void;
}

export function SuccessMessage({ dir, onCancel }: SuccessMessageProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {dir === "rtl" ? "تم تغيير كلمة المرور بنجاح!" : "Password Changed Successfully!"}
          </h3>
          <p className="text-gray-600 mb-4">
            {dir === "rtl"
              ? "تم تحديث كلمة المرور الخاصة بك بنجاح."
              : "Your password has been updated successfully."
            }
          </p>
          {onCancel && (
            <Button onClick={onCancel} variant="outline">
              {dir === "rtl" ? "إغلاق" : "Close"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
