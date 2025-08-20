"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { createProduct, updateProduct, getCategories, getProduct } from "@/lib/actions/products"
import { useAppStore } from "@/lib/stores/app-store";
import ImagesDashboard from "./Images_dashboard"
import RelatedProducts from "./Related_products_dashboard"
import { ProductProps } from "@/types/product"

interface ProductFormProps {
  product?: any
  isEdit?: boolean
}

export function ProductForm({ product, isEdit = false }: ProductFormProps) {

  const { t, dir } = useI18nStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<any[]>([])


  const { productState, updateProductField, updateProductImages, removeProductImage, resetProductForm, setProductForm } = useAppStore();

  const {
    nameEn, nameAr, slug, sku, descriptionEn, descriptionAr, image, images, price, isPriceActive, discountType, discountValue, quantityInStock, brand, isFeatured, size, material, badge, weight, dimensions, status, color, categoryId,
  } = productState;

  useEffect(() => {
    console.log(product);
  }, [])

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

  useEffect(() => {
    loadCategories()
  }, [isEdit, product?.id])


  useEffect(() => {
    fetchProduct()
    // updateProductField("nameEn", product?.nameEn || "")
    // updateProductField("nameAr", product?.nameAr || "")
    // updateProductField("slug", product?.slug || "")
    // updateProductField("sku", product?.sku || "")
    // updateProductField("descriptionEn", product?.descriptionEn || "")
    // updateProductField("descriptionAr", product?.descriptionAr || "")
    // updateProductField("image", product?.image || "")
    // updateProductField("images", product?.images || [])
    // updateProductField("price", product?.price ? Number.parseFloat(product.price) : 0)
    // updateProductField("isPriceActive", product?.isPriceActive || false)
    // updateProductField("discountType", product?.discountType || "none")
    // updateProductField("discountValue", product?.discountValue ? Number.parseFloat(product.discountValue) : undefined)
    // updateProductField("quantityInStock", product?.quantityInStock || 0)
    // updateProductField("brand", product?.brand || "")
    // updateProductField("isFeatured", product?.isFeatured || false)
    // updateProductField("size", product?.size || "")
    // updateProductField("material", product?.material || "")
    // updateProductField("badge", product?.badge || "")
    // updateProductField("weight", product?.weight ? Number.parseFloat(product.weight) : undefined)
    // updateProductField("dimensions", product?.dimensions || "")
    // updateProductField("status", product?.status || "")
    // updateProductField("color", product?.color || "")
    // updateProductField("categoryId", product?.categoryId || undefined)

    console.log(productState);
  }, [isEdit, product?.id])

  const loadCategories = async () => {
    const result = await getCategories()
    if (result.success && result.data) {
      setCategories(result.data)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // إزالة أي رموز غير مقبولة
      .replace(/\s+/g, "-")         // استبدال المسافات بشرطات
      .replace(/-+/g, "-")          // دمج الشرطات المتكررة
      .trim();

  };
  const generateSKU = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const validateForm = (): string | null => {
    if (!nameEn.trim()) return "English name is required"
    if (!nameAr.trim()) return "Arabic name is required"
    if (!sku.trim()) return "SKU is required"
    if (!slug.trim()) return "Slug is required"
    if (isPriceActive === true && (price as number) <= 0) return "Price must be greater than 0"
    // if (quantityInStock < 0) return "Quantity cannot be negative"

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
      const result = isEdit ? await updateProduct(product?.id, productState) : await createProduct(productState)

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

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "المعلومات الأساسية" : "Basic Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/*
              ////////////////////////////////////////////////////////
              /////////                                      /////////
              /////////                                      /////////
              /////////          Product Names               /////////
              /////////                                      /////////
              /////////                                      /////////
              ////////////////////////////////////////////////////////
             */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nameEn" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.nameEn")} *
                  </Label>
                  <Input
                    id="nameEn"
                    value={productState.nameEn}
                    onChange={(e) => handleFormChange("nameEn", e.target.value)}
                    required
                    className={cn(dir === "rtl" && "text-right")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameAr" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.nameAr")} *
                  </Label>
                  <Input
                    id="nameAr"
                    value={nameAr}
                    onChange={(e) => handleFormChange("nameAr", e.target.value)}
                    required
                    className="text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              {/*
              ////////////////////////////////////////////////////////
              /////////                                      /////////
              /////////                                      /////////
              /////////          SKU and Slug                /////////
              /////////                                      /////////
              /////////                                      /////////
              ////////////////////////////////////////////////////////
             */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.sku")} *
                  </Label>
                  <Input
                    id="sku"
                    value={sku}
                    onChange={(e) => handleFormChange("sku", e.target.value)}
                    required
                    className={cn(dir === "rtl" && "text-right")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.slug")} *
                  </Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => handleFormChange("slug", e.target.value)}
                    required
                    className={cn(dir === "rtl" && "text-right")}
                  />
                </div>
              </div>

              {/*
              ////////////////////////////////////////////////////////
              /////////                                      /////////
              /////////                                      /////////
              /////////          Descriptions                /////////
              /////////                                      /////////
              /////////                                      /////////
              ////////////////////////////////////////////////////////
             */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="descriptionEn" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.descriptionEn")}
                  </Label>
                  <Textarea
                    id="descriptionEn"
                    value={descriptionEn}
                    onChange={(e) => handleFormChange("descriptionEn", e.target.value)}
                    rows={4}
                    className={cn(dir === "rtl" && "text-right")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descriptionAr" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.descriptionAr")}
                  </Label>
                  <Textarea
                    id="descriptionAr"
                    value={descriptionAr}
                    onChange={(e) => handleFormChange("descriptionAr", e.target.value)}
                    rows={4}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              {/*
              ////////////////////////////////////////////////////////
              /////////                                      /////////
              /////////                                      /////////
              /////////          Category and Brand         /////////
              /////////                                      /////////
              /////////                                      /////////
              ////////////////////////////////////////////////////////
             */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="categoryId" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.category")}
                  </Label>
                  <Select
                    value={categoryId?.toString() || ""}
                    onValueChange={(value) => handleFormChange("categoryId", value ? Number.parseInt(value) : undefined)}
                  >
                    <SelectTrigger className={cn(dir === "rtl" && "text-right")}>
                      <SelectValue placeholder={dir === "rtl" ? "اختر فئة" : "Select category"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {dir === "rtl" ? category.nameAr : category.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.brand")}
                  </Label>
                  <Input
                    id="brand"
                    value={brand}
                    onChange={(e) => handleFormChange("brand", e.target.value)}
                    className={cn(dir === "rtl" && "text-right")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        {/*
              ////////////////////////////////////////////////////////
              /////////                                      /////////
              /////////                                      /////////
              /////////               Image                  /////////
              /////////                                      /////////
              /////////                                      /////////
              ////////////////////////////////////////////////////////
             */}
        <ImagesDashboard product={product} isEdit={isEdit} />
        {/*
              ////////////////////////////////////////////////////////
              /////////                                      /////////
              /////////                                      /////////
              /////////          Size, Material, Badge       /////////
              /////////                                      /////////
              /////////                                      /////////
              ////////////////////////////////////////////////////////
             */}

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "تفاصيل المنتج" : "Product Details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Size, Material, Badge */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="size" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.size")}
                  </Label>
                  <Input
                    id="size"
                    value={size}
                    onChange={(e) => handleFormChange("size", e.target.value)}
                    className={cn(dir === "rtl" && "text-right")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.material")}
                  </Label>
                  <Input
                    id="material"
                    value={material}
                    onChange={(e) => handleFormChange("material", e.target.value)}
                    className={cn(dir === "rtl" && "text-right")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="badge" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.badge")}
                  </Label>
                  <Input
                    id="badge"
                    value={badge}
                    onChange={(e) => handleFormChange("badge", e.target.value)}
                    placeholder={dir === "rtl" ? "جديد، الأكثر مبيعاً" : "New, Best Seller"}
                    className={cn(dir === "rtl" && "text-right")}
                  />
                </div>
              </div>

              {/*
              ////////////////////////////////////////////////////////
              /////////                                      /////////
              /////////                                      /////////
              /////////          Weight and Dimensions       /////////
              /////////                                      /////////
              /////////                                      /////////
              ////////////////////////////////////////////////////////
             */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weight" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.weight")} (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={weight || ""}
                    onChange={(e) =>
                      handleFormChange("weight", e.target.value ? Number.parseFloat(e.target.value) : undefined)
                    }
                    className={cn(dir === "rtl" && "text-right")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.dimensions")}
                  </Label>
                  <Input
                    id="dimensions"
                    value={dimensions}
                    onChange={(e) => handleFormChange("dimensions", e.target.value)}
                    placeholder={dir === "rtl" ? "الطول × العرض × الارتفاع" : "L × W × H"}
                    className={cn(dir === "rtl" && "text-right")}
                  />
                </div>
              </div>

              {/*
              ////////////////////////////////////////////////////////
              /////////                                      /////////
              /////////                                      /////////
              /////////               Status                /////////
              /////////                                      /////////
              /////////                                      /////////
              ////////////////////////////////////////////////////////
             */}
              <div className="space-y-2">
                <Label htmlFor="status" className={cn(dir === "rtl" && "text-right block")}>
                  {t("common.status")} *
                </Label>
                <Select value={status} onValueChange={(value: any) => handleFormChange("status", value)}>
                  <SelectTrigger className={cn(dir === "rtl" && "text-right")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">{dir === "rtl" ? "جديد" : "New"}</SelectItem>
                    <SelectItem value="sold">{dir === "rtl" ? "مباع" : "Sold"}</SelectItem>
                    <SelectItem value="coming_soon">{dir === "rtl" ? "قريباً" : "Coming Soon"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/*
              ////////////////////////////////////////////////////////
              /////////                                      /////////
              /////////                                      /////////
              /////////          Color                       /////////
              /////////                                      /////////
              /////////                                      /////////
              ////////////////////////////////////////////////////////
             */}
              {/* حقول أخرى زي الاسم والسعر */}
              <div className="flex items-center gap-2 w-full">
                <Label htmlFor="color" className={cn(dir === "rtl" && "text-right block")}>
                  {t("products.color")}
                </Label>
                <Input
                  type="color"
                  id="color"
                  value={color}
                  onChange={(e) => handleFormChange("color", e.target.value)}
                  placeholder={dir === "rtl" ? "اختر لون" : "Choose color"}
                  className={cn(dir === "rtl" && "text-right", "w-12 h-8")}
                />
                <Input
                  type="text"
                  id="color"
                  value={color}
                  onChange={(e) => handleFormChange("color", e.target.value)}
                  placeholder={dir === "rtl" ? "اكتب لون" : "Type color"}
                  className={cn(dir === "rtl" && "text-right", "w-80 h-8")}
                />
                <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
                  <div className="w-full h-full rounded-full " style={{ backgroundColor: color }} />
                </div>
                <span className={cn(dir === "rtl" && "text-right")}>{color}</span>
              </div>
              {/*
              ////////////////////////////////////////////////////////
              /////////                                      /////////
              /////////                                      /////////
              /////////          Featured Product            /////////
              /////////                                      /////////
              /////////                                      /////////
              ////////////////////////////////////////////////////////
             */}

              <div className={cn("flex items-center space-x-2", dir === "rtl" && "flex-row-reverse space-x-reverse")}>
                <Switch
                  id="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={(checked) => handleFormChange("isFeatured", checked)}
                />
                <Label htmlFor="isFeatured" className={cn(dir === "rtl" && "text-right")}>
                  {t("products.featured")}
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "السعر والمخزون" : "Pricing & Inventory"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/*
              ////////////////////////////////////////////////////////
              /////////                                      /////////
              /////////                                      /////////
              /////////               Price                 /////////
              /////////                                      /////////
              /////////                                      /////////
              ////////////////////////////////////////////////////////
             */}

              <div className={cn("flex items-center space-x-2", dir === "rtl" && "flex-row-reverse space-x-reverse")}>
                <Switch
                  id="isPriceActive"
                  onCheckedChange={(checked) => handleFormChange("isPriceActive", checked)}
                />
                <Label htmlFor="isPriceActive" className={cn(dir === "rtl" && "text-right")}>
                  {t("products.addPrice")}
                </Label>
              </div>

              {isPriceActive && (
                <>
                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price" className={cn(dir === "rtl" && "text-right block")}>
                      {t("products.price")} ($) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => handleFormChange("price", Number.parseFloat(e.target.value) || 0)}
                      required
                      placeholder={dir === "rtl" ? "ادخل السعر" : "Enter price"}
                      className={cn(dir === "rtl" && "text-right")}
                    />
                  </div>
                </>
              )
              }

              {/*
              ////////////////////////////////////////////////////////
              /////////                                      /////////
              /////////                                      /////////
              /////////               Discount               /////////
              /////////                                      /////////
              /////////                                      /////////
              ////////////////////////////////////////////////////////
             */}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="discountType" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.discountType")}
                  </Label>
                  <Select
                    value={discountType || "none"}
                    onValueChange={(value: any) => handleFormChange("discountType", value)}
                  >
                    <SelectTrigger className={cn(dir === "rtl" && "text-right")}>
                      <SelectValue placeholder={dir === "rtl" ? "نوع الخصم" : "Discount type"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{dir === "rtl" ? "بدون خصم" : "No discount"}</SelectItem>
                      <SelectItem value="fixed">{t("coupons.fixed")}</SelectItem>
                      <SelectItem value="percentage">{t("coupons.percentage")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountValue" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.discountValue")}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    step="0.01"
                    min="0"
                    value={discountValue || ""}
                    onChange={(e) =>
                      handleFormChange("discountValue", e.target.value ? Number.parseFloat(e.target.value) : undefined)
                    }
                    placeholder={dir === "rtl" ? "قيمة الخصم" : "Discount value"}
                    disabled={!discountType || discountType === ("none" as string)}
                    className={cn(dir === "rtl" && "text-right")}
                  />
                </div>
              </div>

              {/*
              ////////////////////////////////////////////////////////
              /////////                                      /////////
              /////////                                      /////////
              /////////               Quantity              /////////
              /////////                                      /////////
              /////////                                      /////////
              ////////////////////////////////////////////////////////
             */}
              <div className="space-y-2">
                <Label htmlFor="quantityInStock" className={cn(dir === "rtl" && "text-right block")}>
                  {t("products.quantity")} *
                </Label>
                <Input
                  id="quantityInStock"
                  type="number"
                  min="0"
                  value={quantityInStock}
                  onChange={(e) => handleFormChange("quantityInStock", Number.parseInt(e.target.value) || 0)}
                  required
                  className={cn(dir === "rtl" && "text-right")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="related" className="space-y-6">
          <RelatedProducts product={product} isEdit={isEdit} />
        </TabsContent>

      </Tabs>



      {/*
      ////////////////////////////////////////////////////////
      /////////                                      /////////
      /////////                                      /////////
      /////////         submit Form Actions          /////////
      /////////                                      /////////
      /////////                                      /////////
      ////////////////////////////////////////////////////////
     */}
      <div className={cn("flex gap-4", dir === "rtl" && "flex-row-reverse")}>
        <Button type="submit" disabled={loading}>
          {loading ? t("common.loading") : t("common.save")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/products")} disabled={loading}>
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  )
}
