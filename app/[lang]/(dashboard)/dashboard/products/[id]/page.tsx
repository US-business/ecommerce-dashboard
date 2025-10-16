"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAuth, useAuthStore } from "@/lib/stores"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { Edit, ArrowLeft } from "lucide-react"
import { getProduct } from "@/lib/actions/products"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { ProductProps } from "@/types/product"

export default function ProductViewPage() {
  const { t, dir } = useI18nStore()
  const { isSuperAdmin } = useAuthStore()
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<ProductProps | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (params.id) {
      loadProduct()
    }
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
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    )
  }

  if (error) {
    return (
        <div className="text-center py-8">
          <p className="text-destructive">{error}</p>
        </div>
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
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 order-2 sm:order-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/products")}
              className="w-fit"
            >
              <ArrowLeft className={cn("h-4 w-4", dir === "rtl" ? "ml-2 rotate-180" : "mr-2")} />
              {dir === "rtl" ? "العودة" : "Back"}
            </Button>
            <div className={cn(dir === "rtl" && "text-right")}>
              {product && (
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold break-words">{dir === "rtl" ? product.nameAr : product.nameEn}</h1>
              )}
              <p className="text-sm sm:text-base text-muted-foreground">{dir === "rtl" ? "تفاصيل المنتج" : "Product details"}</p>
            </div>
          </div>
          {isSuperAdmin && product && (
            <Button
              onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              <Edit className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
              {t("common.edit")}
            </Button>
          )}
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {/* Product Image - Enhanced with next/image */}
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className={cn("text-base sm:text-lg", dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "صورة المنتج" : "Product Image"}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {product?.images && product.images.length > 0 ? (
                <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={dir === "rtl" ? product.nameAr : product.nameEn}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-48 sm:h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-sm sm:text-base text-muted-foreground">{dir === "rtl" ? "لا توجد صورة" : "No image"}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Information - Responsive */}
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className={cn("text-base sm:text-lg", dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "المعلومات الأساسية" : "Basic Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
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
                  <div className="mt-1">{getStatusBadge(product?.status || "")}</div>
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
  )
}
