import { Button } from "@/components/shadcnUI/button";
import { cn } from "@/lib/utils";
import { Edit } from "lucide-react";
import { ProfileField } from "./ProfileField";
import type { User } from "./types";

interface ProfileViewModeProps {
  user: User;
  dir: "rtl" | "ltr";
  safeDictionary: any;
  onEdit: () => void;
}

export function ProfileViewMode({ user, dir, safeDictionary, onEdit }: ProfileViewModeProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* معلومات أساسية */}
        <ProfileField
          label={safeDictionary.general.name}
          value={user?.username}
          dir={dir}
          fallback={safeDictionary.general.notSpecified}
        />

        <ProfileField
          label={safeDictionary.account.profile.email}
          value={user?.email}
          dir={dir}
        />

        <div className={cn("space-y-2")}>
          <label className="text-sm font-medium text-gray-700 block" dir={dir}>
            {safeDictionary.general.role}
          </label>
          <p className="text-amber-700 border border-amber-700 bg-amber-50 px-2 py-1 rounded" dir={dir}>
            {user?.role === "super_admin"
              ? safeDictionary.general.superAdmin
              : safeDictionary.general.user
            }
          </p>
        </div>

        <ProfileField
          label={safeDictionary.general.joinDate}
          value={new Date().getFullYear().toString()}
          dir={dir}
        />

        {/* العنوان ورقم الهاتف */}
        <ProfileField
          label={safeDictionary.users.address}
          value={user?.address}
          dir={dir}
          fallback={safeDictionary.general.notSpecified}
        />

        <ProfileField
          label={safeDictionary.users.phoneNumber}
          value={user?.phoneNumber}
          dir={dir}
          fallback={safeDictionary.general.notSpecified}
        />
      </div>

      <div className={cn("pt-4")}>
        <Button onClick={onEdit} variant="outline">
          <div className={cn("flex items-center gap-2")}>
            <Edit className="h-4 w-4" />
            <span>{safeDictionary.common.edit}</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
