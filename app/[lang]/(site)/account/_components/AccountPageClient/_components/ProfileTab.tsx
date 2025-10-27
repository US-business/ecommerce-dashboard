import { TabsContent } from "@/components/shadcnUI/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { cn } from "@/lib/utils";
import { ProfileForm } from "../../ProfileForm/ProfileForm";
import { User } from "@/types/user";

interface ProfileTabProps {
  currentUserData: User;
  dir: "rtl" | "ltr";
  safeDictionary: any;
  dictionary: any;
  onUpdate: (updatedUser: any) => void;
}

export function ProfileTab({ currentUserData, dir, safeDictionary, dictionary, onUpdate }: ProfileTabProps) {
  return (
    <TabsContent value="profile" className="space-y-6">
      <Card>
        <CardHeader dir={dir}>
          <CardTitle dir={dir}>{safeDictionary.account.profile.title}</CardTitle>
          <CardDescription dir={dir}>
            {safeDictionary.account.profile.description}
          </CardDescription>
        </CardHeader>
        <CardContent dir={dir}>
          <ProfileForm user={currentUserData} dictionary={dictionary} onUpdate={onUpdate} />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
