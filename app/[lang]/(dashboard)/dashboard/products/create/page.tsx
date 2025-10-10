"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { ProductForm } from "@/components/dashboard/products/product-form"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { cn } from "@/lib/utils"

export default function CreateProductPage() {
  const { t, dir } = useI18nStore() 

 
  return (
        <div className="space-y-6">
          <div className={cn(dir === "rtl" && "text-right")}>
            <h1 className="text-3xl font-bold">{t("products.addProduct")}</h1>
            <p className="text-muted-foreground">
              {dir === "rtl" ? "إضافة منتج جديد إلى متجرك" : "Add a new product to your store"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Product Form</h2>
            <ProductForm />
          </div>
        </div>
  )
}
