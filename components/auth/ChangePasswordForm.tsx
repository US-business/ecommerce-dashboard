"use client"

import { useState } from "react"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Alert, AlertDescription } from "@/components/shadcnUI/alert"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react"

interface ChangePasswordFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function ChangePasswordForm({ onSuccess, onCancel }: ChangePasswordFormProps) {
  const { dir } = useI18nStore()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "", 
    confirmPassword: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
    if (success) setSuccess(false)
  }

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError(dir === "rtl" ? "كلمة المرور الحالية مطلوبة" : "Current password is required")
      return false
    }
    if (!formData.newPassword) {
      setError(dir === "rtl" ? "كلمة المرور الجديدة مطلوبة" : "New password is required")
      return false
    }
    if (formData.newPassword.length < 6) {
      setError(dir === "rtl" ? "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" : "New password must be at least 6 characters")
      return false
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError(dir === "rtl" ? "كلمات المرور الجديدة غير متطابقة" : "New passwords do not match")
      return false
    }
    if (formData.currentPassword === formData.newPassword) {
      setError(dir === "rtl" ? "كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية" : "New password must be different from current password")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const body = new FormData()
      body.append("currentPassword", formData.currentPassword)
      body.append("newPassword", formData.newPassword)

      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        body
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        setError(json.error || (dir === "rtl" ? "فشل في تغيير كلمة المرور" : "Failed to change password"))
      } else {
        setSuccess(true)
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
        
        // استدعاء callback في حالة النجاح
        if (onSuccess) {
          setTimeout(() => {
            onSuccess()
          }, 2000)
        }
      }
    } catch (error) {
      setError(dir === "rtl" ? "حدث خطأ في الخادم" : "Server error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {dir === "rtl" ? "تم تغيير كلمة المرور بنجاح!" : "Password Changed Successfully!"}
            </h3>
            <p className="text-gray-600 mb-4">
              {dir === "rtl" 
                ? "تم تحديث كلمة المرور الخاصة بك بنجاح."
                : "Your password has been updated successfully."
              }
            </p>
            {onCancel && (
              <Button onClick={onCancel} variant="outline">
                {dir === "rtl" ? "إغلاق" : "Close"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className={cn(dir === "rtl" && "text-right")}>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          {dir === "rtl" ? "تغيير كلمة المرور" : "Change Password"}
        </CardTitle>
        <CardDescription>
          {dir === "rtl" 
            ? "قم بتحديث كلمة المرور الخاصة بك لحماية حسابك"
            : "Update your password to keep your account secure"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription className={cn(dir === "rtl" && "text-right")}>{error}</AlertDescription>
            </Alert>
          )}

          {/* كلمة المرور الحالية */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className={cn("text-sm font-medium", dir === "rtl" && "text-right block")}>
              {dir === "rtl" ? "كلمة المرور الحالية" : "Current Password"}
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder={dir === "rtl" ? "أدخل كلمة المرور الحالية" : "Enter current password"}
                required
                disabled={isLoading}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                className={cn("pr-10", dir === "rtl" && "text-right")}
              />
              <button
                type="button"
                className={cn("absolute top-3 h-4 w-4 text-gray-400 hover:text-gray-600", dir === "rtl" ? "left-3" : "right-3")}
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* كلمة المرور الجديدة */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className={cn("text-sm font-medium", dir === "rtl" && "text-right block")}>
              {dir === "rtl" ? "كلمة المرور الجديدة" : "New Password"}
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder={dir === "rtl" ? "أدخل كلمة المرور الجديدة" : "Enter new password"}
                required
                disabled={isLoading}
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                className={cn("pr-10", dir === "rtl" && "text-right")}
              />
              <button
                type="button"
                className={cn("absolute top-3 h-4 w-4 text-gray-400 hover:text-gray-600", dir === "rtl" ? "left-3" : "right-3")}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className={cn("text-xs text-gray-500", dir === "rtl" && "text-right")}>
              {dir === "rtl" 
                ? "يجب أن تكون كلمة المرور 6 أحرف على الأقل"
                : "Password must be at least 6 characters long"
              }
            </p>
          </div>

          {/* تأكيد كلمة المرور الجديدة */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className={cn("text-sm font-medium", dir === "rtl" && "text-right block")}>
              {dir === "rtl" ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={dir === "rtl" ? "أعد إدخال كلمة المرور الجديدة" : "Confirm new password"}
                required
                disabled={isLoading}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={cn("pr-10", dir === "rtl" && "text-right")}
              />
              <button
                type="button"
                className={cn("absolute top-3 h-4 w-4 text-gray-400 hover:text-gray-600", dir === "rtl" ? "left-3" : "right-3")}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className={cn("flex gap-3 pt-4", dir === "rtl" && "flex-row-reverse")}>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{dir === "rtl" ? "جاري التحديث..." : "Updating..."}</span>
                </div>
              ) : (
                dir === "rtl" ? "تحديث كلمة المرور" : "Update Password"
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                {dir === "rtl" ? "إلغاء" : "Cancel"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}