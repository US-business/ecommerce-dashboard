"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAuthStore } from "@/lib/stores/auth-store"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { Edit, ArrowLeft } from "lucide-react"
import { getProduct } from "@/lib/actions/products"
import { cn } from "@/lib/utils"

export default function ProductViewPage() {
  const { t, dir } = useI18nStore()
  const { isSuperAdmin } = useAuthStore()
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadProduct()
  }, [params.id])

  const loadProduct = async () => {
    try {
      const result = await getProduct(Number.parseInt(params.id as string))
      if (result.success && result.data) {
        setProduct(result.data)
      } else {
        setError(result.error || "Product not found")
      }
    } catch (error) {
      setError("Failed to load product")
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

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "default",
      sold: "secondary",
      coming_soon: "outline",
    } as const

    const labels = {
      new: dir === "rtl" ? "جديد" : "New",
      sold: dir === "rtl" ? "مباع" : "Sold",
      coming_soon: dir === "rtl" ? "قريباً" : "Coming Soon",
    }

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
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
              onClick={() => router.push("/dashboard/products")}
              className={cn(dir === "rtl" && "flex-row-reverse")}
            >
              <ArrowLeft className={cn("h-4 w-4", dir === "rtl" ? "ml-2 rotate-180" : "mr-2")} />
              {dir === "rtl" ? "العودة" : "Back"}
            </Button>
            <div className={cn(dir === "rtl" && "text-right")}>
              <h1 className="text-3xl font-bold">{dir === "rtl" ? product?.nameAr : product?.nameEn}</h1>
              <p className="text-muted-foreground">{dir === "rtl" ? "تفاصيل المنتج" : "Product details"}</p>
            </div>
          </div>
          {isSuperAdmin && (
            <Button
              onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
              className={cn(dir === "rtl" && "flex-row-reverse")}
            >
              <Edit className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
              {t("common.edit")}
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Image */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "صورة المنتج" : "Product Image"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product?.image ? (
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={dir === "rtl" ? product.nameAr : product.nameEn}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">{dir === "rtl" ? "لا توجد صورة" : "No image"}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "المعلومات الأساسية" : "Basic Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={cn("grid gap-4", dir === "rtl" && "text-right")}>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("products.nameEn")}</label>
                  <p className="text-lg">{product?.nameEn}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("products.nameAr")}</label>
                  <p className="text-lg text-right" dir="rtl">
                    {product?.nameAr}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("products.sku")}</label>
                  <p>
                    <code>{product?.sku}</code>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("common.status")}</label>
                  <div className="mt-1">{getStatusBadge(product?.status)}</div>
                </div>
                {product?.brand && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t("products.brand")}</label>
                    <p>{product.brand}</p>
                  </div>
                )}
                {product?.color && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t("products.color")}</label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: product.color }} />
                      </div>
                      <p>{product.color}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Descriptions */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "الوصف" : "Description"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product?.descriptionEn && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("products.descriptionEn")}</label>
                  <p className="mt-1 text-sm leading-relaxed">{product.descriptionEn}</p>
                </div>
              )}
              {product?.descriptionAr && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("products.descriptionAr")}</label>
                  <p className="mt-1 text-sm leading-relaxed text-right" dir="rtl">
                    {product.descriptionAr}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "السعر والمخزون" : "Pricing & Inventory"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={cn("grid gap-4", dir === "rtl" && "text-right")}>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("products.price")}</label>
                  <p className="text-2xl font-bold">${product?.price}</p>
                </div>
                {product?.discountType && product?.discountValue && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t("products.discount")}</label>
                    <p>
                      {product.discountValue}
                      {product.discountType === "percentage" ? "%" : "LE"} {dir === "rtl" ? "خصم" : "off"}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("products.quantity")}</label>
                  <p className="text-lg">{product?.quantityInStock}</p>
                </div>
                {product?.isFeatured && (
                  <div>
                    <Badge variant="secondary">{dir === "rtl" ? "منتج مميز" : "Featured Product"}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    // </DashboardLayout>
  )
}
