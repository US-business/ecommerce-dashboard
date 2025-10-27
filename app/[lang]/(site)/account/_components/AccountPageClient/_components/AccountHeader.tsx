import { Card, CardContent } from "@/components/shadcnUI/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcnUI/avatar";
import { Badge } from "@/components/shadcnUI/badge";
import { Button } from "@/components/shadcnUI/button";
import { cn } from "@/lib/utils";
import { Calendar, Shield, Edit } from "lucide-react";
import { UserWithProvider } from "./types";
import { getInitials, getRoleText, getRoleBadgeVariant } from "./utils";

interface AccountHeaderProps {
  currentUser: UserWithProvider;
  safeDictionary: any;
  onEditImage: () => void;
}

export function AccountHeader({ currentUser, safeDictionary, onEditImage }: AccountHeaderProps) {
  return (
    <div className="mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className={cn("flex items-center gap-6")}>
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentUser?.image || ""} alt={currentUser?.username || ""} />
              <AvatarFallback className="text-lg">
                {getInitials(currentUser?.username || currentUser?.email || "U")}
              </AvatarFallback>
            </Avatar>

            <div className={cn("flex-1")}>
              <div className={cn("flex items-center gap-3 mb-2")}>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentUser?.username || "User"}
                </h1>
                <Badge variant={getRoleBadgeVariant(currentUser?.role || "viewer")}>
                  {getRoleText(currentUser?.role || "viewer", safeDictionary)}
                </Badge>
              </div>
              <p className="text-gray-600 mb-3">{currentUser?.email}</p>
              <div className={cn("flex items-center gap-4 text-sm text-gray-500")}>
                <div className={cn("flex items-center gap-1")}>
                  <Calendar className="h-4 w-4" />
                  <span>
                    {safeDictionary.account.general.memberSince} {new Date().getFullYear()}
                  </span>
                </div>
                <div className={cn("flex items-center gap-1")}>
                  <Shield className="h-4 w-4" />
                  <span>
                    {currentUser?.provider === "google"
                      ? safeDictionary.account.general.googleAccount
                      : safeDictionary.account.general.localAccount
                    }
                  </span>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={onEditImage}
            >
              <div className={cn("flex items-center gap-2")}>
                <Edit className="h-4 w-4" />
                <span>{safeDictionary?.account?.editProfilePhoto}</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
