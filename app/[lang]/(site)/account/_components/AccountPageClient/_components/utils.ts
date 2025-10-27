export function getSafeDictionary(dictionary: any) {
  return {
    account: {
      editProfilePhoto: dictionary?.account?.editProfilePhoto || "Edit Profile Photo",
      tabs: {
        profile: dictionary?.account?.tabs?.profile || "Profile",
        orders: dictionary?.account?.tabs?.orders || "Orders",
      },
      profile: {
        title: dictionary?.account?.profile?.title || "Account Information",
        description: dictionary?.account?.profile?.description || "Your personal account information and contact details",
      },
      orders: {
        title: dictionary?.account?.orders?.title || "My Orders", 
        description: dictionary?.account?.orders?.description || "Your order history and current status",
      },
      general: {
        back: dictionary?.account?.general?.back || "Back",
        memberSince: dictionary?.account?.general?.memberSince || "Member since",
        googleAccount: dictionary?.account?.general?.googleAccount || "Google Account",
        localAccount: dictionary?.account?.general?.localAccount || "Local Account",
        security: dictionary?.account?.general?.security || "Security",
        superAdmin: dictionary?.account?.general?.superAdmin || "Super Admin",
        user: dictionary?.account?.general?.user || "User",
        manageGoogleAccount: dictionary?.account?.general?.manageGoogleAccount || "Manage Google Account",
        passwordManagedByGoogle: dictionary?.account?.general?.passwordManagedByGoogle || "Your password is managed through Google. To change your password, please visit your Google account settings.",
        noOrdersYet: dictionary?.account?.general?.noOrdersYet || "No orders yet",
        startShopping: dictionary?.account?.general?.startShopping || "Start Shopping"
      }
    },
    common: {
      edit: dictionary?.common?.edit || "Edit"
    }
  };
}

export function getRoleText(role: string, safeDictionary: any) {
  if (role === "super_admin") {
    return safeDictionary.account.general.superAdmin;
  }
  return safeDictionary.account.general.user;
}

export function getRoleBadgeVariant(role: string): "default" | "secondary" {
  return role === "super_admin" ? "default" : "secondary";
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
