export function getSafeDictionary(dictionary: any) {
  return {
    account: {
      profile: {
        username: dictionary?.account?.profile?.username || "Username",
        email: dictionary?.account?.profile?.email || "Email",
      }
    },
    users: {
      address: dictionary?.users?.address || "Address",
      phoneNumber: dictionary?.users?.phoneNumber || "Phone Number",
    },
    common: {
      save: dictionary?.common?.save || "Save",
      edit: dictionary?.common?.edit || "Edit",
      cancel: dictionary?.common?.cancel || "Cancel",
    },
    notifications: {
      success: {
        updated: dictionary?.notifications?.success?.updated || "Profile updated successfully",
      }
    },
    errors: {
      generic: dictionary?.errors?.generic || "An error occurred",
    },
    general: {
      name: dictionary?.account?.general?.name || "Name",
      role: dictionary?.account?.general?.role || "Role",
      joinDate: dictionary?.account?.general?.joinDate || "Join Date",
      notSpecified: dictionary?.account?.general?.notSpecified || "Not specified",
      saving: dictionary?.account?.general?.saving || "Saving...",
      user: dictionary?.account?.general?.user || "User",
      superAdmin: dictionary?.account?.general?.superAdmin || "Super Admin"
    }
  };
}
