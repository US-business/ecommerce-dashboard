"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { CouponForm } from "@/components/dashboard/coupons/coupon-form"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { cn } from "@/lib/utils"

export default function CreateCouponPage() {
  const { t, dir } = useI18nStore()

  return (
    // <ProtectedRoute requiredRole="super_admin">
        <div className="space-y-6">
          <div className={cn(dir === "rtl" && "text-right")}>
            <h1 className="text-3xl font-bold">{t("coupons.addCoupon")}</h1>
            <p className="text-muted-foreground">
              {dir === "rtl" ? "إضافة كوبون خصم جديد" : "Add a new discount coupon"}
            </p>
          </div>

          <CouponForm />
        </div>
    // </ProtectedRoute>
  )
}
