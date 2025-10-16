"use client"

import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcnUI/select"
import { Switch } from "@/components/shadcnUI/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { TabsContent } from "@/components/shadcnUI/tabs"
import { cn } from "@/lib/utils"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAppStore } from "@/lib/stores/app-store"
import { ProductProps } from "@/types/product"
import { DetailsEditor } from "./DetailsEditor"

interface ProductDetailsProps {
  onFormChange: (field: keyof ProductProps, value: any) => void
}

export function ProductDetails({ onFormChange }: ProductDetailsProps) {
  const { t, dir } = useI18nStore()
  const { productState } = useAppStore()
  
  const {
    offerEn, offerAr, warrantyEn, warrantyAr, status, 
    isFeatured, color
  } = productState

  return (
    <TabsContent value="details" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className={cn(dir === "rtl" && "text-right")}>
            {dir === "rtl" ? "تفاصيل المنتج" : "Product Details"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Details Editor */}
          <div className="grid gap-4 md:grid-cols-2">
            <DetailsEditor type="detailsEn" dir={dir} />
            <DetailsEditor type="detailsAr" dir={dir} />
          </div>

          {/* Offer Fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="offerEn" className={cn(dir === "rtl" && "text-right block")}>
                {t("products.offerEn")}
              </Label>
              <Input
                id="offerEn"
                value={offerEn}
                onChange={(e) => onFormChange("offerEn", e.target.value)}
                className={cn(dir === "rtl" && "text-right")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="offerAr" className={cn(dir === "rtl" && "text-right block")}>
                {t("products.offerAr")}
              </Label>
              <Input
                id="offerAr"
                value={offerAr}
                onChange={(e) => onFormChange("offerAr", e.target.value)}
                className={cn(dir === "rtl" && "text-right")}
              />
            </div>
          </div>

          {/* Warranty Fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="warrantyEn" className={cn(dir === "rtl" && "text-right block")}>
                {t("products.warrantyEn")}
              </Label>
              <Input
                id="warrantyEn"
                value={warrantyEn}
                onChange={(e) => onFormChange("warrantyEn", e.target.value)}
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
                onChange={(e) => onFormChange("warrantyAr", e.target.value)}
                className={cn(dir === "rtl" && "text-right")}
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className={cn(dir === "rtl" && "text-right block")}>
              {t("common.status")} *
            </Label>
            <Select value={status} onValueChange={(value: any) => onFormChange("status", value)}>
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

          {/* Featured Product */}
          <div className={cn("flex items-center space-x-2", dir === "rtl" && "flex-row-reverse space-x-reverse")}>
            <Switch
              id="isFeatured"
              checked={isFeatured}
              onCheckedChange={(checked) => onFormChange("isFeatured", checked)}
            />
            <Label htmlFor="isFeatured" className={cn(dir === "rtl" && "text-right")}>
              {t("products.featured")}
            </Label>
          </div>

          {/* Color */}
          <div className="flex items-center flex-wrap gap-2 w-full">
            <Label htmlFor="color" className={cn(dir === "rtl" && "text-right block")}>
              {t("products.color")}
            </Label>
            <Input
              type="color"
              id="colorPicker"
              value={color}
              onChange={(e) => onFormChange("color", e.target.value)}
              placeholder={dir === "rtl" ? "اختر لون" : "Choose color"}
              className={cn(dir === "rtl" && "text-right", "w-12 h-8")}
            />
            <Input
              type="text"
              id="colorText"
              value={color}
              onChange={(e) => onFormChange("color", e.target.value)}
              placeholder={dir === "rtl" ? "اكتب لون" : "Type color"}
              className={cn(dir === "rtl" && "text-right", "w-80 h-8")}
            />
            <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center">
              <div 
                className="w-full h-full rounded-full" 
                style={{ backgroundColor: color || '#ffffff' }}
              />
            </div>
            <span className={cn(dir === "rtl" && "text-right")}>{color}</span>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
