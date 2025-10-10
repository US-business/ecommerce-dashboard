"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Textarea } from "@/components/shadcnUI/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcnUI/select"
import { Switch } from "@/components/shadcnUI/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcnUI/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcnUI/tabs"
import { cn } from "@/lib/utils"
import { createProduct, updateProduct, getCategories, getProduct, getAllProductsActions } from "@/lib/actions/products"
import { useAppStore } from "@/lib/stores/app-store";
import ImagesDashboard from "./Images_dashboard"
import RelatedProducts from "./Related_products_dashboard"
import { ProductProps } from "@/types/product"
import { Checkbox } from "@/components/shadcnUI/checkbox"
import Image from "next/image"
import { DetailsEditor } from "./DetailsEditor"






interface ProductFormProps {
  product?: ProductProps
  isEdit?: boolean
}

export function ProductForm({ product, isEdit = false }: ProductFormProps) {

  const { t, dir } = useI18nStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [editDetailsEn, setEditDetailsEn] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<any[]>([])
  const [relatedProductsSearch, setRelatedProductsSearch] = useState("");
  const [detailTitleEn, setDetailTitleEn] = useState<string>("");
  const [detailDescriptionEn, setDetailDescriptionEn] = useState<string>("");
  const [detailTitleAr, setDetailTitleAr] = useState("");
  const [detailDescriptionAr, setDetailDescriptionAr] = useState("");


  const { productState, showSaveButtonProduct, setShowSaveButtonProduct, updateProductField, addProductDetails, updateProductDetails, updateProductImages, removeProductImage, resetProductForm, setProductForm } = useAppStore();

  const {
    nameEn, nameAr, slug, sku, descriptionEn, descriptionAr, images, price, isPriceActive, discountType, discountValue, quantityInStock, brand, isFeatured, offerAr, offerEn,
    status, color, categoryId, detailsAr, detailsEn, availableProducts, selectedRelatedProducts, filteredProducts, relatedProducts, warrantyEn, warrantyAr,
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


  const handleEditDetailsEn = ( t : string, i: number) => {
    setEditDetailsEn(!editDetailsEn);
    updateProductDetails({ title: t }, i, "detailsEn")
  }

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






  // ///////////////////////////////////////////////////////// for related Products
  const loadData = useCallback(async () => {
    if (isEdit && product?.id) {
      try {
        // First load the product data
        // Then load available products
        const result = await getAllProductsActions();
        if (result?.success && result?.data) {
          const filteredProductsDB = result.data.filter((p: any) => p.id !== product.id);
          updateProductField("availableProducts", filteredProductsDB);
          updateProductField("filteredProducts", filteredProductsDB);

          // Now set the related products after both product data and available products are loaded
          if (product?.relatedProducts) {
            const relatedIds = product.relatedProducts.map((rp: any) => rp.id);
            updateProductField("selectedRelatedProducts", relatedIds);
            updateProductField("relatedProducts", relatedIds);
          }
        }
      } catch (error) {
        console.error("Error loading product data:", error);
      }
    } else {
      // For new product, just load available products
      const result = await getAllProductsActions();
      if (result?.success && result?.data) {
        updateProductField("availableProducts", result.data);
        updateProductField("filteredProducts", result.data);
      }
    }
  }, [isEdit, product?.id]);

  // useEffect(() => {
  //   // for related Products
  //   loadData();
  // }, []);


  const handleRelatedProductToggle = (productId: number) => {
    const updatedSelectedProducts = selectedRelatedProducts?.includes(productId)
      ? selectedRelatedProducts?.filter((id: any) => id !== productId)
      : [...selectedRelatedProducts ?? [], productId];
    updateProductField("selectedRelatedProducts", updatedSelectedProducts)
    updateProductField("relatedProducts", updatedSelectedProducts)
    console.log(filteredProducts);
  };






  const handleRelatedProductsSearch = (searchTerm: string) => {
    setRelatedProductsSearch(searchTerm)

    if (!searchTerm.trim()) {
      updateProductField("filteredProducts", availableProducts)
      return
    }

    const filtered = availableProducts?.filter((product: any) => {
      const nameEn = product.nameEn?.toLowerCase() || ""
      const nameAr = product.nameAr?.toLowerCase() || ""
      const sku = product.sku?.toLowerCase() || ""
      const brand = product.brand?.toLowerCase() || ""
      const search = searchTerm.toLowerCase()

      return nameEn.includes(search) || nameAr.includes(search) || sku.includes(search) || brand.includes(search)
    })
    updateProductField("filteredProducts", filtered)
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
              /////////             details                  /////////
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
              {/* Details Input*/}
              <div className="grid gap-4 md:grid-cols-3">
                <DetailsEditor type="detailsEn" dir={dir} />
                <DetailsEditor type="detailsAr" dir={dir} />
              </div>

              
              {/* offer  */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="offerEn" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.offerEn")}
                  </Label>
                  <Input
                    id="material"
                    value={offerEn}
                    onChange={(e) => handleFormChange("offerEn", e.target.value)}
                    className={cn(dir === "rtl" && "text-right")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offerAr" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.offerAr")}
                  </Label>
                  <Input
                    id="materialAr"
                    value={offerAr}
                    onChange={(e) => handleFormChange("offerAr", e.target.value)}
                    className={cn(dir === "rtl" && "text-right")}
                  />
                </div>
              </div>
              {/* warranty */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="warrantyEn" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.warrantyEn")}
                  </Label>
                  <Input
                    id="warrantyEn"
                    value={warrantyEn}
                    onChange={(e) => handleFormChange("warrantyEn", e.target.value)}
                    className={cn(dir === "rtl" && "text-right")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warrantyAr" className={cn(dir === "rtl" && "text-right block")}>
                    {t("products.warrantyAr")}
                  </Label>
                  <Input
                    id="warrantyAr"
                    value={warrantyAr}
                    onChange={(e) => handleFormChange("warrantyAr", e.target.value)}
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
                    <SelectValue defaultValue={status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">{dir === "rtl" ? "عادي" : "Normal"}</SelectItem>
                    <SelectItem value="new">{dir === "rtl" ? "جديد" : "New"}</SelectItem>
                    <SelectItem value="best_seller">{dir === "rtl" ? "الأفضل مبيعاً" : "Best Seller"}</SelectItem>
                    <SelectItem value="coming_soon">{dir === "rtl" ? "قريباً" : "Coming Soon"}</SelectItem>
                    <SelectItem value="on_sale">{dir === "rtl" ? "في العرض" : "On Sale"}</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="flex items-center flex-wrap gap-2 w-full">
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
                  checked={isPriceActive}
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





        {/* <TabsContent value="related" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "المنتجات ذات الصلة" : "Related Products"}
              </CardTitle>
              <p className={cn("text-sm text-muted-foreground", dir === "rtl" && "text-right")}>
                {dir === "rtl"
                  ? "اختر المنتجات التي تريد عرضها كمنتجات ذات صلة مع هذا المنتج"
                  : "Select products to display as related to this product"}
              </p>
            </CardHeader>



            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="relatedSearch" className={cn(dir === "rtl" && "text-right block")}>
                  {dir === "rtl" ? "البحث في المنتجات" : "Search Products"}
                </Label>
                <Input
                  id="relatedSearch"
                  type="text"
                  placeholder={
                    dir === "rtl"
                      ? "ابحث بالاسم أو رمز المنتج أو العلامة التجارية..."
                      : "Search by name, SKU, or brand..."
                  }
                  value={relatedProductsSearch}
                  onChange={(e) => handleRelatedProductsSearch(e.target.value)}
                  className={cn(dir === "rtl" && "text-right")}
                />
              </div>

              {relatedProductsSearch && (
                <div className={cn("text-sm text-muted-foreground", dir === "rtl" && "text-right")}>
                  {dir === "rtl"
                    ? `تم العثور على ${filteredProducts?.length} منتج`
                    : `Found ${filteredProducts?.length} products`}
                </div>
              )}

              {filteredProducts && filteredProducts?.length > 0 ? (
                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {filteredProducts && filteredProducts.map((availableProduct: any) => (
                    <div
                      key={availableProduct.id}
                      className={cn(
                        "flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50",
                        dir === "rtl" && "flex-row-reverse space-x-reverse",
                      )}
                    >
                      <Checkbox
                        id={`product-${availableProduct.id}`}
                        checked={selectedRelatedProducts && selectedRelatedProducts?.includes(availableProduct?.id)}
                        onCheckedChange={() => handleRelatedProductToggle(availableProduct?.id)}
                      />
                      <p>{availableProduct?.id}</p>
                      <div className="flex items-center space-x-3 flex-1">
                        {availableProduct.image && (
                          <Image
                            src={availableProduct.image || "/placeholder.svg"}
                            alt={dir === "rtl" ? availableProduct.nameAr : availableProduct.nameEn}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?height=48&width=48&text=No+Image"
                            }}
                          />
                        )}

                        <div className={cn("flex-1", dir === "rtl" && "text-right")}>
                          <Label htmlFor={`product-${availableProduct.id}`} className="font-medium cursor-pointer">
                            {dir === "rtl" ? availableProduct.nameAr : availableProduct.nameEn}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {dir === "rtl" ? `رمز المنتج: ${availableProduct.sku}` : `SKU: ${availableProduct.sku}`}
                          </p>
                          {availableProduct.brand && (
                            <p className="text-sm text-muted-foreground">
                              {dir === "rtl"
                                ? `العلامة التجارية: ${availableProduct.brand}`
                                : `Brand: ${availableProduct.brand}`}
                            </p>
                          )}
                          <p className="text-sm font-medium text-green-600">${availableProduct.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className={cn("text-muted-foreground", dir === "rtl" && "text-right")}>
                    {relatedProductsSearch
                      ? dir === "rtl"
                        ? "لم يتم العثور على منتجات تطابق البحث"
                        : "No products found matching your search"
                      : dir === "rtl"
                        ? "لا توجد منتجات متاحة للاختيار"
                        : "No products available to select"}
                  </p>
                </div>
              )}

              {selectedRelatedProducts && selectedRelatedProducts.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className={cn("text-sm font-medium text-blue-900", dir === "rtl" && "text-right")}>
                    {dir === "rtl"
                      ? `تم اختيار ${selectedRelatedProducts.length} منتج كمنتجات ذات صلة`
                      : `${selectedRelatedProducts.length} products selected as related`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent> */}





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
        <Button type="button" variant="outline" onClick={() => {
          setShowSaveButtonProduct(false);
          router.push("/dashboard/products")
        }} disabled={loading}>
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  )
}
