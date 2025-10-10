
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/shadcnUI/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcnUI/form";
import { Input } from "@/components/shadcnUI/input";
import { useToast } from "@/hooks/use-toast";
import { updateProfile } from "@/lib/actions/users";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Edit, Save, X } from "lucide-react";

const profileFormSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type User = {
  id: number;
  username: string | null;
  email: string;
  role: "super_admin" | "viewer";
  password?: string;
  address?: string | null;
  phoneNumber?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ user, dictionary, onUpdate }: { user: User, dictionary: any, onUpdate?: (updatedUser: any) => void }) {
  const { toast } = useToast();
  const params = useParams()
  const lang = (params?.lang as string) || "en"
  const dir = lang === "ar" ? "rtl" : "ltr"
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Provide fallback values for dictionary fields
  const safeDictionary = {
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

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user.username || "",
      email: user.email || "",
      address: user.address || "",
      phoneNumber: user.phoneNumber || "",
    },
  });

  // تحديث النموذج عند تغيير بيانات المستخدم
  useEffect(() => {
    form.reset({
      username: user.username || "",
      email: user.email || "",
      address: user.address || "",
      phoneNumber: user.phoneNumber || "",
    });
  }, [user, form]);

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);
    try {
      console.log("Submitting profile data:", data);
      const response = await updateProfile(data);
      console.log("Update response:", response);
      
      if (response.success) {
        toast({
          title: safeDictionary.notifications.success.updated,
        });
        setIsEditing(false);
        
        // تحديث البيانات المحلية إذا كان callback متاح
        if (onUpdate && response.data) {
          onUpdate(response.data);
        } else {
          // إعادة تحميل الصفحة كـ fallback
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        console.error("Update failed:", response.error);
        toast({
          title: response.error || safeDictionary.errors.generic,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: safeDictionary.errors.generic,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(dir === "rtl" && "text-right block")}>
                    {safeDictionary.account.profile.username}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={safeDictionary.account.profile.username}
                      className={cn(dir === "rtl" && "text-right")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(dir === "rtl" && "text-right block")}>
                    {safeDictionary.account.profile.email}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={safeDictionary.account.profile.email}
                      className={cn(dir === "rtl" && "text-right")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(dir === "rtl" && "text-right block")}>
                    {safeDictionary.users.address}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={safeDictionary.users.address}
                      className={cn(dir === "rtl" && "text-right")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(dir === "rtl" && "text-right block")}>
                    {safeDictionary.users.phoneNumber}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={safeDictionary.users.phoneNumber}
                      className={cn(dir === "rtl" && "text-right")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={cn("flex gap-3 pt-4", dir === "rtl" && "flex-row-reverse")}>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{safeDictionary.general.saving}</span>
                </div>
              ) : (
                <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
                  <Save className="h-4 w-4" />
                  <span>{safeDictionary.common.save}</span>
                </div>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
                <X className="h-4 w-4" />
                <span>{safeDictionary.common.cancel}</span>
              </div>
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* معلومات أساسية */}
        <div className={cn("space-y-2", dir === "rtl" && "text-right")}>
          <label className="text-sm font-medium text-gray-700">
            {safeDictionary.general.name}
          </label>
          <p className="text-gray-900">
            {user?.username || safeDictionary.general.notSpecified}
          </p>
        </div>

        <div className={cn("space-y-2", dir === "rtl" && "text-right")}>
          <label className="text-sm font-medium text-gray-700">
            {safeDictionary.account.profile.email}
          </label>
          <p className="text-gray-900">{user?.email}</p>
        </div>

        <div className={cn("space-y-2", dir === "rtl" && "text-right")}>
          <label className="text-sm font-medium text-gray-700">
            {safeDictionary.general.role}
          </label>
          <p className="text-gray-900">
            {user?.role === "super_admin"
              ? safeDictionary.general.superAdmin
              : safeDictionary.general.user
            }
          </p>
        </div>

        <div className={cn("space-y-2", dir === "rtl" && "text-right")}>
          <label className="text-sm font-medium text-gray-700">
            {safeDictionary.general.joinDate}
          </label>
          <p className="text-gray-900">
            {new Date().getFullYear()}
          </p>
        </div>

        {/* العنوان ورقم الهاتف */}
        <div className={cn("space-y-2", dir === "rtl" && "text-right")}>
          <label className="text-sm font-medium text-gray-700">
            {safeDictionary.users.address}
          </label>
          <p className="text-gray-900">
            {user?.address || safeDictionary.general.notSpecified}
          </p>
        </div>

        <div className={cn("space-y-2", dir === "rtl" && "text-right")}>
          <label className="text-sm font-medium text-gray-700">
            {safeDictionary.users.phoneNumber}
          </label>
          <p className="text-gray-900">
            {user?.phoneNumber || safeDictionary.general.notSpecified}
          </p>
        </div>
      </div>

      <div className={cn("pt-4", dir === "rtl" && "text-right")}>
        <Button onClick={() => setIsEditing(true)} variant="outline">
          <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
            <Edit className="h-4 w-4" />
            <span>{safeDictionary.common.edit}</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
