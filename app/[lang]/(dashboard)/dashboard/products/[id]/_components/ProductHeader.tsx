"use client"

import { Button } from "@/components/shadcnUI/button"
import { Edit, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProductProps } from "@/types/product"

interface ProductHeaderProps {
  product: ProductProps | null
  dir: "ltr" | "rtl"
  t: (key: string) => string
  isSuperAdmin: boolean
  onBack: () => void
  onEdit: (id: number) => void
}

export function ProductHeader({ product, dir, t, isSuperAdmin, onBack, onEdit }: ProductHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 order-2 sm:order-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="w-fit"
        >
          <ArrowLeft className={cn("h-4 w-4", dir === "rtl" ? "ml-2 rotate-180" : "mr-2")} />
          {t("common.back")}
        </Button>
        <div className={cn(dir === "rtl" && "text-right")}> 
          {product && (
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold break-words">
              {dir === "rtl" ? product.nameAr : product.nameEn}
            </h1>
          )}
          <p className="text-sm sm:text-base text-muted-foreground">{t("products.productDetails")}</p>
        </div>
      </div>
      {isSuperAdmin && product && (
        <Button
          onClick={() => onEdit(product!.id as number)}
          className="w-full sm:w-auto order-1 sm:order-2"
        >
          <Edit className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
          {t("common.edit")}
        </Button>
      )}
    </div>
  )
}
