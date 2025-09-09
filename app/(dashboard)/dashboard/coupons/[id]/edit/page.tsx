"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { CouponForm } from "@/components/dashboard/coupons/coupon-form"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { getCoupon } from "@/lib/actions/coupons"
import { cn } from "@/lib/utils"

export default function EditCouponPage() {
  const { t, dir } = useI18nStore()
  const params = useParams()
  const [coupon, setCoupon] = useState(null)
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
        // <DashboardLayout> 
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        // </DashboardLayout> 
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
            <h1 className="text-3xl font-bold">{t("coupons.editCoupon")}</h1>
            <p className="text-muted-foreground">
              {dir === "rtl" ? "تعديل معلومات الكوبون" : "Edit coupon information"}
            </p>
          </div>

          {coupon && <CouponForm coupon={coupon} isEdit={true} />}
        </div>
    // </ProtectedRoute>
  )
}
