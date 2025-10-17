"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { UserForm } from "@/components/dashboard/users/user-form"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { cn } from "@/lib/utils"

export default function CreateUserPage() {
  const { t, dir } = useI18nStore()

  return (
    // <ProtectedRoute requiredRole="super_admin">
        <div className="space-y-6">
          <div className={cn(dir === "rtl" && "text-right")}>
            <h1 className="text-3xl font-bold">{t("users.addUser")}</h1>
            <p className="text-muted-foreground">
              {dir === "rtl" ? "إضافة مستخدم جديد إلى النظام" : "Add a new user to the system"}
            </p>
          </div>

          <UserForm />
        </div>
    // </ProtectedRoute>
  )
}
