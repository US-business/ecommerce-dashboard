"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAuth, useAuthStore } from "@/lib/stores"
import { getProduct } from "@/lib/actions/products"
import { ProductProps } from "@/types/product"
import { 
  ProductHeader,
  ProductImageCard,
  BasicInfoCard,
  DescriptionsCard,
  PricingInventoryCard,
} from "./_components"

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

  return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Responsive */}
        <ProductHeader
          product={product}
          dir={dir}
          t={t}
          isSuperAdmin={isSuperAdmin}
          onBack={() => router.push("/dashboard/products")}
          onEdit={(id) => router.push(`/dashboard/products/${id}/edit`)}
        />

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {/* Product Image - Enhanced with next/image */}
          <ProductImageCard product={product} dir={dir} t={t} />

          {/* Basic Information - Responsive */}
          <BasicInfoCard product={product} dir={dir} t={t} />

          {/* Descriptions */}
          <DescriptionsCard product={product} dir={dir} t={t} />

          {/* Pricing & Inventory */}
          <PricingInventoryCard product={product} dir={dir} t={t} />
        </div>
      </div>
  )
}
