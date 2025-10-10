"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { UserForm } from "@/components/dashboard/users/user-form"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { getUser } from "@/lib/actions/users"
import { cn } from "@/lib/utils"

export default function EditUserPage() {
  const { t, dir } = useI18nStore()
  const params = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadUser()
  }, [params.id])

  const loadUser = async () => {
    try {
      const result = await getUser(Number.parseInt(params.id as string))
      if (result.success && result.data) {
        setUser(result.data)
      } else {
        setError(result.error || "User not found")
      }
    } catch (error) {
      setError("Failed to load user")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      // <ProtectedRoute requiredRole="super_admin">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
      // </ProtectedRoute>
    )
  }

  if (error) {
    return (
      // <ProtectedRoute requiredRole="super_admin">
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
          </div>
      // </ProtectedRoute>
    )
  }

  return (
    // <ProtectedRoute requiredRole="super_admin">
        <div className="space-y-6">
          <div className={cn(dir === "rtl" && "text-right")}>
            <h1 className="text-3xl font-bold">{t("users.editUser")}</h1>
            <p className="text-muted-foreground">
              {dir === "rtl" ? "تعديل معلومات المستخدم" : "Edit user information"}
            </p>
          </div>

          {user && <UserForm user={user} isEdit={true} />}
        </div>
    // </ProtectedRoute>
  )
}
