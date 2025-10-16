"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { ProductForm } from "@/components/dashboard/products/product-form"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { getProduct } from "@/lib/actions/products"
import { cn } from "@/lib/utils"

export default function EditProductPage() {
  const { t, dir } = useI18nStore()
  const params = useParams()
  const [product, setProduct] = useState(null)
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

  return (
        <div className="space-y-6">
          <div className={cn(dir === "rtl" && "text-right")}>
            <h1 className="text-3xl font-bold">{t("products.editProduct")}</h1>
            <p className="text-muted-foreground">
              {dir === "rtl" ? "تعديل معلومات المنتج" : "Edit product information"}
            </p>
          </div>

          {product && <ProductForm product={product} isEdit={true} />}
        </div>
  )
}
