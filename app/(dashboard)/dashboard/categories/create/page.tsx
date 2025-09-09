"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { CategoryForm } from "@/components/dashboard/categories/category-form"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { cn } from "@/lib/utils"

export default function CreateCategoryPage() {
  const { t, dir } = useI18nStore()

  return (
    // <ProtectedRoute requiredRole="super_admin">
    //  <DashboardLayout> 
    <div className="space-y-6">
      <div className={cn(dir === "rtl" && "text-right")}>
        <h1 className="text-3xl font-bold">{t("categories.addCategory")}</h1>
        <p className="text-muted-foreground">
          {dir === "rtl" ? "إضافة فئة جديدة للمنتجات" : "Add a new product category"}
        </p>
      </div>

      <CategoryForm />
    </div>
    // </DashboardLayout> 
    // </ProtectedRoute>
  )
}
