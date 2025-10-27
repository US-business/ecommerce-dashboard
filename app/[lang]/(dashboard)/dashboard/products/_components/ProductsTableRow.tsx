"use client"

import { TableCell, TableRow } from "@/components/shadcnUI/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcnUI/dropdown-menu"
import { Button } from "@/components/shadcnUI/button"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAuthStore } from "@/lib/stores"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Package } from "lucide-react"
import { getStatusBadge, getProductName, getCategoryName } from "./utils"

interface Product {
  id: number
  nameEn: string
  nameAr: string
  slug: string
  sku: string
  price: string
  quantityInStock: number
  status: "normal" | "new" | "coming_soon" | "on_sale" | "best_seller"
  color?: string
  isFeatured: boolean
  brand?: string
  images: string[]
  descriptionEn: string
  descriptionAr: string
  tags?: string
  createdAt: Date
  category?: {
    id: number
    nameEn: string
    nameAr: string
  }
}

interface ProductsTableRowProps {
  product: Product
  dictionary: any
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function ProductsTableRow({
  product,
  dictionary,
  onView,
  onEdit,
  onDelete
}: ProductsTableRowProps) {
  const { t, dir } = useI18nStore()
  const { isSuperAdmin } = useAuthStore()

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        {product.images && product.images.length > 0 ? (
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded overflow-hidden">
            <Image
              src={product.images[0]}
              alt={getProductName(product, dir)}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        ) : (
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded flex items-center justify-center">
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </TableCell>

      <TableCell>
        <div className="min-w-[120px] sm:min-w-[160px]">
          <div className={cn("font-medium text-sm sm:text-base truncate block max-w-[20vw] overflow-hidden whitespace-nowrap")}>
            {getProductName(product, dir)}
          </div>
          {product.brand && (
            <div className="text-xs sm:text-sm text-muted-foreground truncate">
              {product.brand}
            </div>
          )}
        </div>
      </TableCell>

      <TableCell className={cn("hidden md:table-cell")}>
        <code className="text-xs sm:text-sm bg-muted px-2 py-1 rounded">{product.sku}</code>
      </TableCell>

      <TableCell className={cn("font-semibold text-sm sm:text-base")}>
        ${product.price}
      </TableCell>

      <TableCell className={cn("hidden lg:table-cell")}>
        <span className={cn(
          "text-sm",
          product.quantityInStock === 0 && "text-destructive font-semibold",
          product.quantityInStock > 0 && product.quantityInStock < 10 && "text-orange-600 font-semibold"
        )}>
          {product.quantityInStock}
        </span>
      </TableCell>

      <TableCell className="hidden sm:table-cell ">
        <span className={cn(" text-white")}>
          {getStatusBadge(product.status, t)}
        </span>
      </TableCell>

      <TableCell className={cn("hidden xl:table-cell")}>
        <span className="text-sm truncate max-w-[120px] inline-block">
          {getCategoryName(product.category, dir)}
        </span>
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
            <DropdownMenuItem onClick={() => onView(product.id)}>
              <Eye className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
              {t("common.view")}
            </DropdownMenuItem>
            {isSuperAdmin && (
              <>
                <DropdownMenuItem onClick={() => onEdit(product.id)}>
                  <Edit className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                  {dictionary.common.edit}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(product.id)}
                  className={cn("text-destructive")}
                >
                  <Trash2 className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                  {dictionary.common.delete}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
