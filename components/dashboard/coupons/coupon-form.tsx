"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcnUI/select"
import { Switch } from "@/components/shadcnUI/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Alert, AlertDescription } from "@/components/shadcnUI/alert"
import { cn } from "@/lib/utils"
import { createCoupon, updateCoupon, type CouponFormData } from "@/lib/actions/coupons"

interface CouponFormProps {
  coupon?: any
  isEdit?: boolean
}

export function CouponForm({ coupon, isEdit = false }: CouponFormProps) {
  const { t, dir } = useI18nStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<CouponFormData>({
    code: coupon?.code || "", 
    isActive: coupon?.isActive ?? true,
    discountType: coupon?.discountType || "percentage",
    discountValue: coupon?.discountValue ? Number.parseFloat(coupon.discountValue) : 0,
    validFrom: coupon?.validFrom ? new Date(coupon.validFrom).toISOString().slice(0, 16) : "",
    validTo: coupon?.validTo ? new Date(coupon.validTo).toISOString().slice(0, 16) : "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = isEdit ? await updateCoupon(coupon.id, formData) : await createCoupon(formData)

      if (result.success) {
        router.push("/dashboard/coupons")
      } else {
        setError(result.error || "Failed to save coupon")
      }
    } catch (error) {
      setError("An error occurred while saving the coupon")
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: keyof CouponFormData, value: any) => {
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
            {dir === "rtl" ? "معلومات الكوبون" : "Coupon Information"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Coupon Code */}
          <div className="space-y-2">
            <Label htmlFor="code" className={cn(dir === "rtl" && "text-right block")}>
              {t("coupons.code")} *
            </Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => updateFormData("code", e.target.value.toUpperCase())}
              required
              placeholder={dir === "rtl" ? "مثال: SAVE20" : "e.g., SAVE20"}
              className={cn(dir === "rtl" && "text-right")}
            />
            <p className={cn("text-sm text-muted-foreground", dir === "rtl" && "text-right")}>
              {dir === "rtl"
                ? "سيتم تحويل الكود إلى أحرف كبيرة تلقائياً"
                : "Code will be automatically converted to uppercase"}
            </p>
          </div>

          {/* Discount Type and Value */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="discountType" className={cn(dir === "rtl" && "text-right block")}>
                {t("coupons.discountType")} *
              </Label>
              <Select
                value={formData.discountType}
                onValueChange={(value: any) => updateFormData("discountType", value)}
              >
                <SelectTrigger className={cn(dir === "rtl" && "text-right")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">{t("coupons.fixed")}</SelectItem>
                  <SelectItem value="percentage">{t("coupons.percentage")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountValue" className={cn(dir === "rtl" && "text-right block")}>
                {t("coupons.discountValue")} *
              </Label>
              <Input
                id="discountValue"
                type="number"
                step="0.01"
                min="0"
                max={formData.discountType === "percentage" ? "100" : undefined}
                value={formData.discountValue}
                onChange={(e) => updateFormData("discountValue", Number.parseFloat(e.target.value) || 0)}
                required
                className={cn(dir === "rtl" && "text-right")}
              />
              <p className={cn("text-sm text-muted-foreground", dir === "rtl" && "text-right")}>
                {formData.discountType === "percentage"
                  ? dir === "rtl"
                    ? "النسبة المئوية (0-100)"
                    : "Percentage (0-100)"
                  : dir === "rtl"
                    ? "المبلغ بالجنيه"
                    : "Amount in LE"}
              </p>
            </div>
          </div>

          {/* Validity Window */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="validFrom" className={cn(dir === "rtl" && "text-right block")}>{dir === "rtl" ? "تاريخ بداية الصلاحية" : "Valid From"}</Label>
              <Input
                id="validFrom"
                type="datetime-local"
                value={(formData.validFrom as string) || ""}
                onChange={(e) => updateFormData("validFrom", e.target.value || "")}
                className={cn(dir === "rtl" && "text-right")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validTo" className={cn(dir === "rtl" && "text-right block")}>{dir === "rtl" ? "تاريخ نهاية الصلاحية" : "Valid To"}</Label>
              <Input
                id="validTo"
                type="datetime-local"
                value={(formData.validTo as string) || ""}
                onChange={(e) => updateFormData("validTo", e.target.value || "")}
                className={cn(dir === "rtl" && "text-right")}
              />
            </div>
          </div>

          {/* Active Status */}
          <div className={cn("flex items-center space-x-2", dir === "rtl" && "flex-row-reverse space-x-reverse")}>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => updateFormData("isActive", checked)}
            />
            <Label htmlFor="isActive" className={cn(dir === "rtl" && "text-right")}>
              {dir === "rtl" ? "كوبون نشط" : "Active Coupon"}
            </Label>
          </div>

          {/* Preview */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className={cn("font-medium mb-2", dir === "rtl" && "text-right")}>
              {dir === "rtl" ? "معاينة الكوبون" : "Coupon Preview"}
            </h4>
            <div className={cn("text-sm", dir === "rtl" && "text-right")}>
              <p>
                <strong>{dir === "rtl" ? "الكود:" : "Code:"}</strong> {formData.code || "---"}
              </p>
              <p>
                <strong>{dir === "rtl" ? "الخصم:" : "Discount:"}</strong>{" "}
                {formData.discountValue > 0
                  ? formData.discountType === "percentage"
                    ? `${formData.discountValue}%`
                    : `LE ${formData.discountValue}`
                  : "---"}
              </p>
              <p>
                <strong>{dir === "rtl" ? "الصلاحية من:" : "Valid From:"}</strong> {formData.validFrom ? new Date(formData.validFrom as string).toLocaleString() : "---"}
              </p>
              <p>
                <strong>{dir === "rtl" ? "الصلاحية إلى:" : "Valid To:"}</strong> {formData.validTo ? new Date(formData.validTo as string).toLocaleString() : "---"}
              </p>
              <p>
                <strong>{dir === "rtl" ? "الحالة:" : "Status:"}</strong>{" "}
                {formData.isActive ? (dir === "rtl" ? "نشط" : "Active") : dir === "rtl" ? "غير نشط" : "Inactive"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className={cn("flex gap-4", dir === "rtl" && "flex-row-reverse")}>
        <Button type="submit" disabled={loading}>
          {loading ? t("common.loading") : t("common.save")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/coupons")} disabled={loading}>
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  )
}
