"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Alert, AlertDescription } from "@/components/shadcnUI/alert"
import { cn } from "@/lib/utils"
import { createCategory, updateCategory, type CategoryFormData } from "@/lib/actions/categories"

interface CategoryFormProps {
  category?: any
  isEdit?: boolean
}

export function CategoryForm({ category, isEdit = false }: CategoryFormProps) {
  const { t, dir } = useI18nStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<CategoryFormData>({ 
    nameEn: category?.nameEn || "",
    nameAr: category?.nameAr || "",
    slug: category?.slug || "",
    image: category?.image || "",
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = isEdit ? await updateCategory(category.id, formData) : await createCategory(formData)

      if (result.success) {
        router.push("/dashboard/categories")
      } else {
        setError(result.error || "Failed to save category")
      }
    } catch (error) {
      setError("An error occurred while saving the category")
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: keyof CategoryFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-generate slug from English name
    if (field === "nameEn" && value) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }))
    }
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
            {dir === "rtl" ? "معلومات الفئة" : "Category Information"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Names */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nameEn" className={cn(dir === "rtl" && "text-right block")}>
                {t("categories.nameEn")} *
              </Label>
              <Input
                id="nameEn"
                value={formData.nameEn}
                onChange={(e) => updateFormData("nameEn", e.target.value)}
                required
                className={cn(dir === "rtl" && "text-right")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameAr" className={cn(dir === "rtl" && "text-right block")}>
                {t("categories.nameAr")} *
              </Label>
              <Input
                id="nameAr"
                value={formData.nameAr}
                onChange={(e) => updateFormData("nameAr", e.target.value)}
                required
                className="text-right"
                dir="rtl"
              />
            </div>
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug" className={cn(dir === "rtl" && "text-right block")}>
              {t("categories.slug")} *
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => updateFormData("slug", e.target.value)}
              required
              className={cn(dir === "rtl" && "text-right")}
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label htmlFor="image" className={cn(dir === "rtl" && "text-right block")}>
              {t("categories.image")}
            </Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => updateFormData("image", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={cn(dir === "rtl" && "text-right")}
            />
          </div>

          {/* Image Preview */}
          {formData.image && (
            <div className="space-y-2">
              <Label className={cn(dir === "rtl" && "text-right block")}>
                {dir === "rtl" ? "معاينة الصورة" : "Image Preview"}
              </Label>
              <img
                src={formData.image || "/placeholder.svg"}
                alt="Category preview"
                className="w-32 h-32 object-cover rounded-lg border"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className={cn("flex gap-4", dir === "rtl" && "flex-row-reverse")}>
        <Button type="submit" disabled={loading}>
          {loading ? t("common.loading") : t("common.save")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/categories")} disabled={loading}>
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  )
}
