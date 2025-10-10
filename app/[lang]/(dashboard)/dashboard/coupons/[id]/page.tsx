"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { Edit, ArrowLeft, Ticket, Calendar, Percent, DollarSign } from "lucide-react"
import { getCoupon } from "@/lib/actions/coupons"
import { cn } from "@/lib/utils"

export default function CouponViewPage() {
  const { t, dir } = useI18nStore()
  const params = useParams()
  const router = useRouter()
  const [coupon, setCoupon] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadCoupon()
  }, [params.id])

  const loadCoupon = async () => {
    try {
      const result = await getCoupon(Number.parseInt(params.id as string))
      if (result.success && result.data) {
        setCoupon(result.data)
      } else {
        setError(result.error || "Coupon not found")
      }
    } catch (error) {
      setError("Failed to load coupon")
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

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"}>
        {isActive ? (dir === "rtl" ? "نشط" : "Active") : dir === "rtl" ? "غير نشط" : "Inactive"}
      </Badge>
    )
  }

  const getDiscountDisplay = (type: string, value: any) => {
    const num = Number.parseFloat(String(value ?? 0)) || 0
    return type === "percentage" ? `${num}%` : `LE ${num.toFixed(2)}`
  }

  const formatDateTime = (d: any) => {
    if (!d) return "—"
    try { return new Date(d as any).toLocaleString() } catch { return "—" }
  }

  return (
    // <ProtectedRoute requiredRole="super_admin">
        <div className="space-y-6">
          {/* Header */}
          <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
            <div className={cn("flex items-center gap-4", dir === "rtl" && "flex-row-reverse")}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/coupons")}
                className={cn(dir === "rtl" && "flex-row-reverse")}
              >
                <ArrowLeft className={cn("h-4 w-4", dir === "rtl" ? "ml-2 rotate-180" : "mr-2")} />
                {dir === "rtl" ? "العودة" : "Back"}
              </Button>
              <div className={cn(dir === "rtl" && "text-right")}>
                <h1 className="text-3xl font-bold">{coupon?.code}</h1>
                <p className="text-muted-foreground">{dir === "rtl" ? "تفاصيل الكوبون" : "Coupon details"}</p>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/dashboard/coupons/${coupon.id}/edit`)}
              className={cn(dir === "rtl" && "flex-row-reverse")}
            >
              <Edit className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
              {t("common.edit")}
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Coupon Code & Status */}
            <Card>
              <CardHeader>
                <CardTitle className={cn(dir === "rtl" && "text-right")}>
                  {dir === "rtl" ? "معلومات الكوبون" : "Coupon Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={cn("flex items-center gap-4", dir === "rtl" && "flex-row-reverse")}>
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Ticket className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className={cn(dir === "rtl" && "text-right")}>
                    <code className="text-2xl font-bold font-mono">{coupon?.code}</code>
                    <div className="mt-1">{getStatusBadge(coupon?.isActive)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Discount Information */}
            <Card>
              <CardHeader>
                <CardTitle className={cn(dir === "rtl" && "text-right")}>
                  {dir === "rtl" ? "معلومات الخصم" : "Discount Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
                  {coupon?.discountType === "percentage" ? (
                    <Percent className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div className={cn(dir === "rtl" && "text-right")}>
                    <p className="text-sm text-muted-foreground">{t("coupons.discountType")}</p>
                    <p className="font-medium">
                      {coupon?.discountType === "fixed" ? t("coupons.fixed") : t("coupons.percentage")}
                    </p>
                  </div>
                </div>

                <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {getDiscountDisplay(coupon?.discountType, coupon?.discountValue)}
                    </span>
                  </div>
                  <div className={cn(dir === "rtl" && "text-right")}>
                    <p className="text-sm text-muted-foreground">{t("coupons.discountValue")}</p>
                    <p className="font-medium">
                      {coupon?.discountType === "percentage"
                        ? dir === "rtl"
                          ? "خصم نسبي"
                          : "Percentage discount"
                        : dir === "rtl"
                          ? "خصم ثابت"
                          : "Fixed amount discount"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dates Information */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "معلومات التواريخ" : "Date Information"}
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className={cn("grid gap-4 md:grid-cols-2", dir === "rtl" && "text-right")}>
                <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className={cn(dir === "rtl" && "text-right")}>
                    <p className="text-sm text-muted-foreground">{dir === "rtl" ? "تاريخ الإنشاء" : "Created At"}</p>
                      <p className="font-medium">{formatDateTime(coupon?.createdAt)}</p>
                  </div>
                </div>
                <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className={cn(dir === "rtl" && "text-right")}>
                    <p className="text-sm text-muted-foreground">{dir === "rtl" ? "آخر تحديث" : "Last Updated"}</p>
                      <p className="font-medium">{formatDateTime(coupon?.updatedAt)}</p>
                  </div>
                </div>
                  <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className={cn(dir === "rtl" && "text-right")}>
                      <p className="text-sm text-muted-foreground">{dir === "rtl" ? "بداية الصلاحية" : "Valid From"}</p>
                      <p className="font-medium">{formatDateTime(coupon?.validFrom)}</p>
                    </div>
                  </div>
                  <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className={cn(dir === "rtl" && "text-right")}>
                      <p className="text-sm text-muted-foreground">{dir === "rtl" ? "نهاية الصلاحية" : "Valid To"}</p>
                      <p className="font-medium">{formatDateTime(coupon?.validTo)}</p>
                    </div>
                  </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Preview */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "معاينة الاستخدام" : "Usage Preview"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <div className={cn("text-center space-y-2", dir === "rtl" && "text-right")}>
                  <p className="text-sm text-muted-foreground">
                    {dir === "rtl"
                      ? "مثال على كيفية ظهور هذا الكوبون للعملاء:"
                      : "Example of how this coupon appears to customers:"}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md">
                    <Ticket className="h-4 w-4" />
                    <span className="font-mono font-bold">{coupon?.code}</span>
                    <span>-</span>
                    <span className="font-semibold">
                      {getDiscountDisplay(coupon?.discountType, coupon?.discountValue)}
                    </span>
                    {dir === "rtl" ? "خصم" : "OFF"}
                  </div>
                  {!coupon?.isActive && (
                    <p className="text-sm text-destructive">
                      {dir === "rtl" ? "هذا الكوبون غير نشط حالياً" : "This coupon is currently inactive"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    // </ProtectedRoute>
  )
}
