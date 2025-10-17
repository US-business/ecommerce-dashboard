"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { CategoryForm } from "@/components/dashboard/categories/category-form"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { getCategory } from "@/lib/actions/categories"
import { cn } from "@/lib/utils"

export default function EditCategoryPage() {
  const { t, dir } = useI18nStore()
  const params = useParams()
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadCategory()
  }, [params.id])

  const loadCategory = async () => {
    try {
      const result = await getCategory(Number.parseInt(params.id as string))
      if (result.success && result.data) {
        setCategory(result.data)
      } else {
        setError(result.error || "Category not found")
      }
    } catch (error) {
      setError("Failed to load category")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      // <DashboardLayout>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      // </DashboardLayout>
    )
  }

  if (error) {
    return (
      // <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-destructive">{error}</p>
        </div>
      // </DashboardLayout>
    )
  }

  return (
    // <ProtectedRoute requiredRole="super_admin">
      // <DashboardLayout> 
        <div className="space-y-6">
          <div className={cn(dir === "rtl" && "text-right")}>
            <h1 className="text-3xl font-bold">{t("categories.editCategory")}</h1>
            <p className="text-muted-foreground">
              {dir === "rtl" ? "تعديل معلومات الفئة" : "Edit category information"}
            </p>
          </div>

          {category && <CategoryForm category={category} isEdit={true} />}
        </div>
      // </DashboardLayout>
    // </ProtectedRoute>
  )
}
