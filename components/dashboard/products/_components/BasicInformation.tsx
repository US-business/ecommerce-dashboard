"use client"

import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Textarea } from "@/components/shadcnUI/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcnUI/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { TabsContent } from "@/components/shadcnUI/tabs"
import { cn } from "@/lib/utils"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAppStore } from "@/lib/stores/app-store"
import { ProductProps } from "@/types/product"

type Category = { id: number; nameEn: string; nameAr: string; slug: string }

interface BasicInformationProps {
  categories: Category[]
  onFormChange: (field: keyof ProductProps, value: any) => void
}

export function BasicInformation({ categories, onFormChange }: BasicInformationProps) {
  const { t, dir } = useI18nStore()
  const { productState } = useAppStore()
  
  const {
    nameEn, nameAr, slug, sku, descriptionEn, descriptionAr, 
    categoryId, brand
  } = productState

  return (
    <TabsContent value="basic" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className={cn(dir === "rtl" && "text-right")}>
            {dir === "rtl" ? "المعلومات الأساسية" : "Basic Information"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Names */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nameEn" className={cn(dir === "rtl" && "text-right block")}>
                {t("products.nameEn")} *
              </Label>
              <Input
                id="nameEn"
                value={nameEn}
                onChange={(e) => onFormChange("nameEn", e.target.value)}
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
                onChange={(e) => onFormChange("nameAr", e.target.value)}
                required
                className="text-right"
                dir="rtl"
              />
            </div>
          </div>

          {/* SKU and Slug */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sku" className={cn(dir === "rtl" && "text-right block")}>
                {t("products.sku")} *
              </Label>
              <Input
                id="sku"
                value={sku}
                onChange={(e) => onFormChange("sku", e.target.value)}
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
                onChange={(e) => onFormChange("slug", e.target.value)}
                required
                className={cn(dir === "rtl" && "text-right")}
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="descriptionEn" className={cn(dir === "rtl" && "text-right block")}>
                {t("products.descriptionEn")}
              </Label>
              <Textarea
                id="descriptionEn"
                value={descriptionEn}
                onChange={(e) => onFormChange("descriptionEn", e.target.value)}
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
                onChange={(e) => onFormChange("descriptionAr", e.target.value)}
                rows={4}
                className="text-right"
                dir="rtl"
              />
            </div>
          </div>

          {/* Category and Brand */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="categoryId" className={cn(dir === "rtl" && "text-right block")}>
                {t("products.category")}
              </Label>
              <Select
                value={categoryId?.toString() || ""}
                onValueChange={(value) => onFormChange("categoryId", value ? Number.parseInt(value) : undefined)}
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
                onChange={(e) => onFormChange("brand", e.target.value)}
                className={cn(dir === "rtl" && "text-right")}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
