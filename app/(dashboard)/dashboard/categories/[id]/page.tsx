"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAuthStore } from "@/lib/stores/auth-store"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Edit, ArrowLeft } from "lucide-react"
import { getCategory } from "@/lib/actions/categories"
import { cn } from "@/lib/utils"

export default function CategoryViewPage() {
  const { t, dir } = useI18nStore()
  const { isSuperAdmin } = useAuthStore()
  const params = useParams()
  const router = useRouter()
  const [category, setCategory] = useState<any>(null)
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
    // <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-4", dir === "rtl" && "flex-row-reverse")}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/categories")}
              className={cn(dir === "rtl" && "flex-row-reverse")}
            >
              <ArrowLeft className={cn("h-4 w-4", dir === "rtl" ? "ml-2 rotate-180" : "mr-2")} />
              {dir === "rtl" ? "العودة" : "Back"}
            </Button>
            <div className={cn(dir === "rtl" && "text-right")}>
              <h1 className="text-3xl font-bold">{dir === "rtl" ? category?.nameAr : category?.nameEn}</h1>
              <p className="text-muted-foreground">{dir === "rtl" ? "تفاصيل الفئة" : "Category details"}</p>
            </div>
          </div>
          {isSuperAdmin && (
            <Button
              onClick={() => router.push(`/dashboard/categories/${category.id}/edit`)}
              className={cn(dir === "rtl" && "flex-row-reverse")}
            >
              <Edit className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
              {t("common.edit")}
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Category Image */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "صورة الفئة" : "Category Image"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {category?.image ? (
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={dir === "rtl" ? category.nameAr : category.nameEn}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">{dir === "rtl" ? "لا توجد صورة" : "No image"}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Information */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "معلومات الفئة" : "Category Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={cn("grid gap-4", dir === "rtl" && "text-right")}>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("categories.nameEn")}</label>
                  <p className="text-lg">{category?.nameEn}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("categories.nameAr")}</label>
                  <p className="text-lg text-right" dir="rtl">
                    {category?.nameAr}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("categories.slug")}</label>
                  <p>
                    <code>{category?.slug}</code>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {dir === "rtl" ? "تاريخ الإنشاء" : "Created At"}
                  </label>
                  <p>{new Date(category?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    // </DashboardLayout>
  )
}
