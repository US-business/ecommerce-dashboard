import { Button } from "@/components/shadcnUI/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Alert, AlertDescription } from "@/components/shadcnUI/alert";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import { PasswordInput } from "./PasswordInput";
import { PasswordFormData } from "./types";

interface ChangePasswordFormContentProps {
  dir: "rtl" | "ltr";
  formData: PasswordFormData;
  isLoading: boolean;
  error: string;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
}

export function ChangePasswordFormContent({
  dir,
  formData,
  isLoading,
  error,
  onInputChange,
  onSubmit,
  onCancel
}: ChangePasswordFormContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          {dir === "rtl" ? "تغيير كلمة المرور" : "Change Password"}
        </CardTitle>
        <CardDescription>
          {dir === "rtl"
            ? "قم بتحديث كلمة المرور الخاصة بك لحماية حسابك"
            : "Update your password to keep your account secure"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <PasswordInput
            id="currentPassword"
            label={dir === "rtl" ? "كلمة المرور الحالية" : "Current Password"}
            placeholder={dir === "rtl" ? "أدخل كلمة المرور الحالية" : "Enter current password"}
            value={formData.currentPassword}
            onChange={(value) => onInputChange("currentPassword", value)}
            disabled={isLoading}
            dir={dir}
          />

          <PasswordInput
            id="newPassword"
            label={dir === "rtl" ? "كلمة المرور الجديدة" : "New Password"}
            placeholder={dir === "rtl" ? "أدخل كلمة المرور الجديدة" : "Enter new password"}
            value={formData.newPassword}
            onChange={(value) => onInputChange("newPassword", value)}
            disabled={isLoading}
            dir={dir}
            helperText={
              dir === "rtl"
                ? "يجب أن تكون كلمة المرور 6 أحرف على الأقل"
                : "Password must be at least 6 characters long"
            }
          />

          <PasswordInput
            id="confirmPassword"
            label={dir === "rtl" ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}
            placeholder={dir === "rtl" ? "أعد إدخال كلمة المرور الجديدة" : "Confirm new password"}
            value={formData.confirmPassword}
            onChange={(value) => onInputChange("confirmPassword", value)}
            disabled={isLoading}
            dir={dir}
          />

          <div className={cn("flex gap-3 pt-4")}>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{dir === "rtl" ? "جاري التحديث..." : "Updating..."}</span>
                </div>
              ) : (
                dir === "rtl" ? "تحديث كلمة المرور" : "Update Password"
              )}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                {dir === "rtl" ? "إلغاء" : "Cancel"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
