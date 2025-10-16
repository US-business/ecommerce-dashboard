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

interface InventoryPricingProps {
  onFormChange: (field: keyof ProductProps, value: any) => void
}

export function InventoryPricing({ onFormChange }: InventoryPricingProps) {
  const { t, dir } = useI18nStore()
  const { productState } = useAppStore()
  
  const {
    price, isPriceActive, discountType, discountValue, quantityInStock
  } = productState

  return (
    <TabsContent value="inventory" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className={cn(dir === "rtl" && "text-right")}>
            {dir === "rtl" ? "السعر والمخزون" : "Pricing & Inventory"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Price Toggle */}
          <div className={cn("flex items-center space-x-2", dir === "rtl" && "flex-row-reverse space-x-reverse")}>
            <Switch
              checked={isPriceActive}
              id="isPriceActive"
              onCheckedChange={(checked) => onFormChange("isPriceActive", checked)}
            />
            <Label htmlFor="isPriceActive" className={cn(dir === "rtl" && "text-right")}>
              {t("products.addPrice")}
            </Label>
          </div>

          {/* Price Field */}
          {isPriceActive && (
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
                onChange={(e) => onFormChange("price", Number.parseFloat(e.target.value) || 0)}
                required
                placeholder={dir === "rtl" ? "ادخل السعر" : "Enter price"}
                className={cn(dir === "rtl" && "text-right")}
              />
            </div>
          )}

          {/* Discount Fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="discountType" className={cn(dir === "rtl" && "text-right block")}>
                {t("products.discountType")}
              </Label>
              <Select
                value={discountType || "none"}
                onValueChange={(value: any) => onFormChange("discountType", value)}
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
                  onFormChange("discountValue", e.target.value ? Number.parseFloat(e.target.value) : undefined)
                }
                placeholder={dir === "rtl" ? "قيمة الخصم" : "Discount value"}
                disabled={!discountType || discountType === "none"}
                className={cn(dir === "rtl" && "text-right")}
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantityInStock" className={cn(dir === "rtl" && "text-right block")}>
              {t("products.quantity")} *
            </Label>
            <Input
              id="quantityInStock"
              type="number"
              min="0"
              value={quantityInStock}
              onChange={(e) => onFormChange("quantityInStock", Number.parseInt(e.target.value) || 0)}
              required
              className={cn(dir === "rtl" && "text-right")}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
