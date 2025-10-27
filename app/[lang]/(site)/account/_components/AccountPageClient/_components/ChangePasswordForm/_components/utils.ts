import { PasswordFormData } from "./types";

export function validatePasswordForm(
  formData: PasswordFormData,
  dir: "rtl" | "ltr"
): { isValid: boolean; error: string } {
  if (!formData.currentPassword) {
    return {
      isValid: false,
      error: dir === "rtl" ? "كلمة المرور الحالية مطلوبة" : "Current password is required"
    };
  }

  if (!formData.newPassword) {
    return {
      isValid: false,
      error: dir === "rtl" ? "كلمة المرور الجديدة مطلوبة" : "New password is required"
    };
  }

  if (formData.newPassword.length < 6) {
    return {
      isValid: false,
      error: dir === "rtl" 
        ? "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" 
        : "New password must be at least 6 characters"
    };
  }

  if (formData.newPassword !== formData.confirmPassword) {
    return {
      isValid: false,
      error: dir === "rtl" ? "كلمات المرور الجديدة غير متطابقة" : "New passwords do not match"
    };
  }

  if (formData.currentPassword === formData.newPassword) {
    return {
      isValid: false,
      error: dir === "rtl" 
        ? "كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية" 
        : "New password must be different from current password"
    };
  }

  return { isValid: true, error: "" };
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const body = new FormData();
    body.append("currentPassword", currentPassword);
    body.append("newPassword", newPassword);

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      body
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      return {
        success: false,
        error: json.error || "Failed to change password"
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Server error occurred"
    };
  }
}
