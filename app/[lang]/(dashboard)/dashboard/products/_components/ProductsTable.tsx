"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcnUI/table"
import { Package, ChevronUp, ChevronDown } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { cn } from "@/lib/utils"
import { ProductsTableRow } from "./ProductsTableRow"
import { ProductsPagination } from "./ProductsPagination"

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

interface ProductsTableProps {
  products: Product[]
  dictionary: any
  currentPage: number
  totalPages: number
  totalProducts: number
  limit: number
  sortBy: string
  sortOrder: string
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onSort: (column: string) => void
  onPageChange: (page: number) => void
}

export function ProductsTable({
  products,
  dictionary,
  currentPage,
  totalPages,
  totalProducts,
  limit,
  sortBy,
  sortOrder,
  onView,
  onEdit,
  onDelete,
  onSort,
  onPageChange,
}: ProductsTableProps) {
  const { t, dir } = useI18nStore()

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null
    return sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className={cn("text-base sm:text-lg")}>
            {t("products.productsList")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {totalProducts} {t("products.productsCount")} |
            {" "}{t("products.page")} {currentPage} {t("products.of")} {totalPages}
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={cn("w-16 sm:w-20")}>
                  {dictionary.products.image}
                </TableHead>
                <TableHead
                  className={cn("cursor-pointer hover:bg-muted/50 transition-colors")}
                  onClick={() => onSort('nameEn')}
                >
                  <div className="flex items-center gap-1">
                    {dictionary.products.name}
                    <SortIcon column="nameEn" />
                  </div>
                </TableHead>
                <TableHead className={cn("hidden md:table-cell")}>
                  {dictionary.products.sku}
                </TableHead>
                <TableHead
                  className={cn("cursor-pointer hover:bg-muted/50 transition-colors")}
                  onClick={() => onSort('price')}
                >
                  <div className="flex items-center gap-1">
                    {dictionary.products.price}
                    <SortIcon column="price" />
                  </div>
                </TableHead>
                <TableHead className={cn("hidden lg:table-cell")}>
                  {dictionary.products.quantity}
                </TableHead>
                <TableHead className={cn("hidden sm:table-cell")}>
                  {dictionary.common.status}
                </TableHead>
                <TableHead className={cn("hidden xl:table-cell")}>
                  {dictionary.products.category}
                </TableHead>
                <TableHead className={cn("w-16")}>
                  {dictionary.common.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-12 w-12 text-muted-foreground" />
                      <p className="text-sm sm:text-base font-medium">
                        {t("products.noProducts")}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <ProductsTableRow
                    key={product.id}
                    product={product}
                    dictionary={dictionary}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <ProductsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalProducts={totalProducts}
          limit={limit}
          onPageChange={onPageChange}
        />
      </CardContent>
    </Card>
  )
}
