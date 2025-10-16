"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Alert, AlertDescription } from "@/components/shadcnUI/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcnUI/tabs"
import { cn } from "@/lib/utils"
import { createProduct, updateProduct, getCategories, getProduct } from "@/lib/actions/products"
import { useAppStore } from "@/lib/stores/app-store";
import { ProductProps } from "@/types/product"
import { 
  BasicInformation,
  ProductDetails,
  InventoryPricing,
  FormActions,
  ImagesDashboard,
  RelatedProducts
} from "./_components"






interface ProductFormProps {
  product?: ProductProps
  isEdit?: boolean
}

export function ProductForm({ product, isEdit = false }: ProductFormProps) {

  const { t, dir } = useI18nStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  type Category = { id: number; nameEn: string; nameAr: string; slug: string }
  const [categories, setCategories] = useState<Category[]>([])

  const { productState, updateProductField, resetProductForm, setProductForm } = useAppStore()

  const handleFormChange = (field: keyof ProductProps, value: any) => {
    updateProductField(field, value);
    if (field === "discountType" && value === "none") {
      updateProductField("discountValue", undefined);
      return
    }
    if (field === "nameEn" && value) {
      updateProductField("slug", generateSlug(value))
    }
  };


  const fetchProduct = useCallback(async () => {
    if (isEdit && product?.id) {
      try {
        const productDB = await getProduct(product.id)
        if (productDB.success && productDB.data) {
          setProductForm(productDB.data)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      }
    } else {
      resetProductForm()
    }
  }, [isEdit, product?.id])

  // Removed duplicate useEffect - now handled in single useEffect above

  const loadCategories = async () => {
    const result = await getCategories()
    if (result.success && result.data) {
      setCategories(result.data)
    }
  }

  // Initialize categories on mount
  useEffect(() => {
    loadCategories()
  }, [])
  
  // Initialize product data
  useEffect(() => {
    fetchProduct()
  }, [isEdit, product?.id, fetchProduct])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // إزالة أي رموز غير مقبولة
      .replace(/\s+/g, "-")         // استبدال المسافات بشرطات
      .replace(/-+/g, "-")          // دمج الشرطات المتكررة
      .trim();

  };
  const validateForm = (): string | null => {
    const { nameEn, nameAr, sku, slug, isPriceActive, price } = productState
    
    if (!nameEn?.trim()) return "English name is required"
    if (!nameAr?.trim()) return "Arabic name is required"
    if (!sku?.trim()) return "SKU is required"
    if (!slug?.trim()) return "Slug is required"
    if (isPriceActive === true && (price as number) <= 0) return "Price must be greater than 0"

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const result = isEdit ? await updateProduct(Number(product?.id), productState) : await createProduct(productState)

      if (result.success) {
        router.push("/dashboard/products")
      } else {
        setError(result.error || "Failed to save product")
      }
    } catch (error) {
      setError("An error occurred while saving the product")
      console.error('Form submission error:', error)
    } finally {
      setLoading(false)
    }
  }






  // Related products logic is handled by RelatedProducts component



















  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription className={cn(dir === "rtl" && "text-right")}>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">{dir === "rtl" ? "أساسي" : "Basic"}</TabsTrigger>
          <TabsTrigger value="images">{dir === "rtl" ? "الصور" : "images"}</TabsTrigger>
          <TabsTrigger value="details">{dir === "rtl" ? "تفاصيل" : "Details"}</TabsTrigger>
          <TabsTrigger value="inventory">{dir === "rtl" ? "المخزون" : "Inventory"}</TabsTrigger>
          <TabsTrigger value="related">{dir === "rtl" ? "منتاجات ذات علاقة" : "Related Product"}</TabsTrigger>
        </TabsList>

        <BasicInformation categories={categories} onFormChange={handleFormChange} />


        <ImagesDashboard product={product} isEdit={isEdit} />
        <ProductDetails onFormChange={handleFormChange} />

        <InventoryPricing onFormChange={handleFormChange} />


        <TabsContent value="related" className="space-y-6">
          <RelatedProducts product={product} isEdit={isEdit} />
        </TabsContent>





      </Tabs>



      <FormActions loading={loading} onSubmit={handleSubmit} />
    </form>
  )
}
