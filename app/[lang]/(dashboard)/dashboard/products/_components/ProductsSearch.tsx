"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Input } from "@/components/shadcnUI/input"
import { Search, Loader2 } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { cn } from "@/lib/utils"

interface ProductsSearchProps {
  dictionary: any
  search: string
  isNavigating: boolean
  onSearchChange: (value: string) => void
}

export function ProductsSearch({ 
  dictionary, 
  search, 
  isNavigating, 
  onSearchChange 
}: ProductsSearchProps) {
  const { t, dir } = useI18nStore()

  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className={cn("text-base sm:text-lg")}>
          {dictionary.common.search}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="relative">
          <Search
            className={cn("absolute top-2.5 h-4 w-4 text-muted-foreground", dir === "rtl" ? "right-3" : "left-3")}
          />
          <Input
            placeholder={t("products.searchPlaceholder")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn("text-sm sm:text-base px-10")}
          />
          {isNavigating && (
            <Loader2 className={cn("absolute top-2.5 h-4 w-4 text-muted-foreground animate-spin", dir === "rtl" ? "left-3" : "right-3")} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
