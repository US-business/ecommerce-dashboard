import { TabsList, TabsTrigger } from "@/components/shadcnUI/tabs";
import { cn } from "@/lib/utils";
import { User as UserIcon, Mail, Lock } from "lucide-react";

interface AccountTabsProps {
  dir: "rtl" | "ltr";
  safeDictionary: any;
}

export function AccountTabs({ dir, safeDictionary }: AccountTabsProps) {
  return (
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="profile">
        <div className={cn("flex items-center gap-2")}>
          <UserIcon className="h-4 w-4" />
          <span dir={dir}>{safeDictionary.account.tabs.profile}</span>
        </div>
      </TabsTrigger>
      <TabsTrigger value="security">
        <div className={cn("flex items-center gap-2")}>
          <Lock className="h-4 w-4" />
          <span dir={dir}>{safeDictionary.account.general.security}</span>
        </div>
      </TabsTrigger>
      <TabsTrigger value="orders">
        <div className={cn("flex items-center gap-2")}>
          <Mail className="h-4 w-4" />
          <span dir={dir}>{safeDictionary.account.tabs.orders}</span>
        </div>
      </TabsTrigger>
    </TabsList>
  );
}
