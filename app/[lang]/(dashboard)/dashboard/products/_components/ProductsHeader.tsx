"use client"

import { Button } from "@/components/shadcnUI/button"
import { Plus } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAuthStore } from "@/lib/stores"
import { cn } from "@/lib/utils"

interface ProductsHeaderProps {
  dictionary: any
  onAddProduct: () => void
}

export function ProductsHeader({ dictionary, onAddProduct }: ProductsHeaderProps) {
  const { t, dir } = useI18nStore()
  const { isSuperAdmin } = useAuthStore()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className={cn(dir === "rtl" && "text-right")}>
        <h1 className="text-2xl sm:text-3xl font-bold">{dictionary.products.title}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t("products.manageProducts")}
        </p>
      </div>
      {isSuperAdmin && (
        <Button onClick={onAddProduct} className={cn("w-full sm:w-auto")}>
          <Plus className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
          {dictionary.products.addProduct}
        </Button>
      )}
    </div>
  )
}
