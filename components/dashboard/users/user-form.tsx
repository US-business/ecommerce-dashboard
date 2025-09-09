"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcnUI/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Alert, AlertDescription } from "@/components/shadcnUI/alert"
import { cn } from "@/lib/utils"
import { createUser, updateUser, type UserFormData } from "@/lib/actions/users"

interface UserFormProps {
  user?: any
  isEdit?: boolean
}

export function UserForm({ user, isEdit = false }: UserFormProps) {
  const { t, dir } = useI18nStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<UserFormData>({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    address: user?.address || "",
    phoneNumber: user?.phoneNumber || "",
    role: user?.role || "viewer",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // For edit mode, only include password if it's provided
      const submitData = { ...formData }
      if (isEdit && !submitData.password) {
        delete submitData.password
      }

      const result = isEdit ? await updateUser(user.id, submitData) : await createUser(submitData)

      if (result.success) {
        router.push("/dashboard/users")
      } else {
        setError(result.error || "Failed to save user")
      }
    } catch (error) {
      setError("An error occurred while saving the user")
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: keyof UserFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription className={cn(dir === "rtl" && "text-right")}>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className={cn(dir === "rtl" && "text-right")}>
            {dir === "rtl" ? "معلومات المستخدم" : "User Information"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Username and Email */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username" className={cn(dir === "rtl" && "text-right block")}>
                {t("users.username")} *
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => updateFormData("username", e.target.value)}
                required
                className={cn(dir === "rtl" && "text-right")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className={cn(dir === "rtl" && "text-right block")}>
                {t("users.email")} *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                required
                className={cn(dir === "rtl" && "text-right")}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className={cn(dir === "rtl" && "text-right block")}>
              {t("users.password")} {!isEdit && "*"}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => updateFormData("password", e.target.value)}
              required={!isEdit}
              placeholder={
                isEdit
                  ? dir === "rtl"
                    ? "اتركه فارغاً للاحتفاظ بكلمة المرور الحالية"
                    : "Leave empty to keep current password"
                  : ""
              }
              className={cn(dir === "rtl" && "text-right")}
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className={cn(dir === "rtl" && "text-right block")}>
              {t("users.role")} *
            </Label>
            <Select value={formData.role} onValueChange={(value: any) => updateFormData("role", value)}>
              <SelectTrigger className={cn(dir === "rtl" && "text-right")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">{t("users.viewer")}</SelectItem>
                <SelectItem value="super_admin">{t("users.superAdmin")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className={cn(dir === "rtl" && "text-right block")}>
              {t("users.address")}
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateFormData("address", e.target.value)}
              className={cn(dir === "rtl" && "text-right")}
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className={cn(dir === "rtl" && "text-right block")}>
              {t("users.phoneNumber")}
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => updateFormData("phoneNumber", e.target.value)}
              className={cn(dir === "rtl" && "text-right")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className={cn("flex gap-4", dir === "rtl" && "flex-row-reverse")}>
        <Button type="submit" disabled={loading}>
          {loading ? t("common.loading") : t("common.save")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/users")} disabled={loading}>
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  )
}
