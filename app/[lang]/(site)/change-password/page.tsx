"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAuth } from "@/lib/stores"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Alert, AlertDescription } from "@/components/shadcnUI/alert"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle } from "lucide-react"
import { useSession } from "next-auth/react"

export default function ChangePasswordPage() {
  const { t, dir, locale } = useI18nStore()
  const params = useParams()
  const lang = locale || "ar"
  const { user } = useAuth()
  const { data: session } = useSession()
  const router = useRouter()
  
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

  // التحقق من تسجيل الدخول
  if (!user && !session) {
    router.push(`/${lang}/signin`)
    return null
  }

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
        
        // إعادة توجيه بعد 3 ثواني
        setTimeout(() => {
          router.push(`/${lang}/account`)
        }, 3000)
      }
    } catch (error) {
      setError(dir === "rtl" ? "حدث خطأ في الخادم" : "Server error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {dir === "rtl" ? "تم تغيير كلمة المرور بنجاح!" : "Password Changed Successfully!"}
              </h2>
              <p className="text-gray-600 mb-6">
                {dir === "rtl" 
                  ? "تم تحديث كلمة المرور الخاصة بك. سيتم توجيهك إلى الصفحة الرئيسية خلال ثوانٍ قليلة."
                  : "Your password has been updated. You will be redirected to the home page in a few seconds."
                }
              </p>
              <Button 
                onClick={() => router.push(`/${lang}/account`)}
                className="w-full"
              >
                {dir === "rtl" ? "العودة إلى الحساب" : "Go to Account"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* زر العودة */}
        <div className={cn("flex", dir === "rtl" ? "justify-end" : "justify-start")}>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}
          >
            <ArrowLeft className={cn("h-4 w-4", dir === "rtl" && "rotate-180")} />
            {dir === "rtl" ? "العودة" : "Back"}
          </Button>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {dir === "rtl" ? "تغيير كلمة المرور" : "Change Password"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {dir === "rtl" 
              ? "قم بتحديث كلمة المرور الخاصة بك لحماية حسابك"
              : "Update your password to keep your account secure"
            }
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className={cn("space-y-1", dir === "rtl" && "text-right")}>
            <CardTitle className="text-2xl text-center text-gray-900">
              {dir === "rtl" ? "كلمة مرور جديدة" : "New Password"}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {dir === "rtl" 
                ? "أدخل كلمة المرور الحالية والجديدة"
                : "Enter your current and new password"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription className={cn(dir === "rtl" && "text-right")}>{error}</AlertDescription>
                </Alert>
              )}

              {/* كلمة المرور الحالية */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className={cn("text-sm font-medium text-gray-700", dir === "rtl" && "text-right block")}>
                  {dir === "rtl" ? "كلمة المرور الحالية" : "Current Password"}
                </Label>
                <div className="relative">
                  <Lock className={cn("absolute top-3 h-4 w-4 text-gray-400", dir === "rtl" ? "right-3" : "left-3")} />
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder={dir === "rtl" ? "أدخل كلمة المرور الحالية" : "Enter current password"}
                    required
                    disabled={isLoading}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                    className={cn("pl-10 pr-10", dir === "rtl" && "pr-10 pl-10 text-right")}
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
                <Label htmlFor="newPassword" className={cn("text-sm font-medium text-gray-700", dir === "rtl" && "text-right block")}>
                  {dir === "rtl" ? "كلمة المرور الجديدة" : "New Password"}
                </Label>
                <div className="relative">
                  <Lock className={cn("absolute top-3 h-4 w-4 text-gray-400", dir === "rtl" ? "right-3" : "left-3")} />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder={dir === "rtl" ? "أدخل كلمة المرور الجديدة" : "Enter new password"}
                    required
                    disabled={isLoading}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    className={cn("pl-10 pr-10", dir === "rtl" && "pr-10 pl-10 text-right")}
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
                <Label htmlFor="confirmPassword" className={cn("text-sm font-medium text-gray-700", dir === "rtl" && "text-right block")}>
                  {dir === "rtl" ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}
                </Label>
                <div className="relative">
                  <Lock className={cn("absolute top-3 h-4 w-4 text-gray-400", dir === "rtl" ? "right-3" : "left-3")} />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={dir === "rtl" ? "أعد إدخال كلمة المرور الجديدة" : "Confirm new password"}
                    required
                    disabled={isLoading}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={cn("pl-10 pr-10", dir === "rtl" && "pr-10 pl-10 text-right")}
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

              {/* زر التحديث */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{dir === "rtl" ? "جاري التحديث..." : "Updating..."}</span>
                  </div>
                ) : (
                  dir === "rtl" ? "تحديث كلمة المرور" : "Update Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}