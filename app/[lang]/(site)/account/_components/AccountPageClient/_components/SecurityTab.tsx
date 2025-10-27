import { TabsContent } from "@/components/shadcnUI/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Button } from "@/components/shadcnUI/button";
import { cn } from "@/lib/utils";
import { ChangePasswordForm } from "@/app/[lang]/(site)/account/_components/AccountPageClient/_components/ChangePasswordForm/ChangePasswordForm";
import { UserWithProvider } from "./types";

interface SecurityTabProps {
  currentUser: UserWithProvider;
  dir: "rtl" | "ltr";
  safeDictionary: any;
  onPasswordChangeSuccess: () => void;
}

export function SecurityTab({ currentUser, dir, safeDictionary, onPasswordChangeSuccess }: SecurityTabProps) {
  return (
    <TabsContent value="security" className="space-y-6">
      {currentUser?.provider === "google" ? (
        <Card>
          <CardHeader dir={dir}>
            <CardTitle dir={dir}>{safeDictionary.account.general.googleAccount}</CardTitle>
            <CardDescription dir={dir}>
              {safeDictionary.account.general.passwordManagedByGoogle}
            </CardDescription>
          </CardHeader>
          <CardContent dir={dir}>
            <Button
              variant="outline"
              onClick={() => window.open("https://myaccount.google.com/security", "_blank")}
            >
              {safeDictionary.account.general.manageGoogleAccount}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ChangePasswordForm onSuccess={onPasswordChangeSuccess} />
      )}
    </TabsContent>
  );
}
