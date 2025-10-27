"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { updateProfile } from "@/lib/actions/users";
import { useParams } from "next/navigation";
import {
  ProfileViewMode,
  ProfileEditMode,
  getSafeDictionary,
  profileFormSchema,
  type ProfileFormProps,
  type ProfileFormValues
} from "./_components";

export function ProfileForm({ user, dictionary, onUpdate }: ProfileFormProps) {
  const { toast } = useToast();
  const params = useParams()
  const lang = (params?.lang as string) || "en"
  const dir = lang === "ar" ? "rtl" : "ltr"
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const safeDictionary = getSafeDictionary(dictionary);

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
      <ProfileEditMode
        form={form}
        dir={dir}
        safeDictionary={safeDictionary}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ProfileViewMode
      user={user}
      dir={dir}
      safeDictionary={safeDictionary}
      onEdit={() => setIsEditing(true)}
    />
  );
}
