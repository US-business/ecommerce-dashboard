"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcnUI/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcnUI/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/shadcnUI/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/shadcnUI/alert-dialog"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Package, ChevronUp, ChevronDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { deleteProduct } from "@/lib/actions/products"
import { useAuthStore } from "@/lib/stores"
import Image from "next/image"

interface Product {
  id: number
  nameEn: string
  nameAr: string
  slug: string
  sku: string
  price: string
  quantityInStock: number
  status: "normal" | "new" | "coming_soon" | "on_sale"  | "best_seller"
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

interface ProductsListProps {
  initialProducts: Product[]
  dictionary: any
  currentPage: number
  totalPages: number
  totalProducts: number
  limit: number
  sortBy: string
  sortOrder: string
}

export function ProductsList({ 
  initialProducts, 
  dictionary, 
  currentPage, 
  totalPages, 
  totalProducts,
  limit,
  sortBy,
  sortOrder 
}: ProductsListProps) {
  const { t, dir } = useI18nStore()
  const { isSuperAdmin } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    const handler = setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search)
      if (search) {
        searchParams.set("search", search)
        searchParams.set("page", "1") // Reset to first page on new search
      } else {
        searchParams.delete("search")
      }
      setIsNavigating(true)
      router.push(`${pathname}?${searchParams.toString()}`)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [search, router, pathname])

  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const result = await deleteProduct(deleteId)
      if (result.success) {
        // Optimistically update the UI
        setProducts(products.filter(p => p.id !== deleteId))
        setDeleteId(null)
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
    } finally {
      setDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "default",
      on_sale: "secondary",
      best_seller: "destructive",
      normal: "default",
      coming_soon: "outline",
    } as const

    const labels = {
      new: dir === "rtl" ? "جديد" : "New",
      on_sale: dir === "rtl" ? "خصم" : "On Sale",
      best_seller: dir === "rtl" ? "أفضل" : "Best Seller",
      coming_soon: dir === "rtl" ? "قريباً" : "Coming Soon",
      normal: dir === "rtl" ? "عادي" : "Normal",
    }

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const handleAddProduct = () => {
    router.push("/dashboard/products/create")
  }

  const updateSearchParams = (key: string, value: string) => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set(key, value)
    setIsNavigating(true)
    router.push(`${pathname}?${searchParams.toString()}`)
  }

  const handlePageChange = (page: number) => {
    updateSearchParams("page", page.toString())
  }

  const handleSort = (column: string) => {
    const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc'
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set("sortBy", column)
    searchParams.set("sortOrder", newSortOrder)
    setIsNavigating(true)
    router.push(`${pathname}?${searchParams.toString()}`)
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null
    return sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  const renderPaginationItems = () => {
    const items = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      )
      if (startPage > 2) {
        items.push(<PaginationEllipsis key="ellipsis-start" />)
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => handlePageChange(i)} 
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<PaginationEllipsis key="ellipsis-end" />)
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)} 
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className={cn(dir === "rtl" && "text-right")}>
            <h1 className="text-2xl sm:text-3xl font-bold">{dictionary.products.title}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {dir === "rtl" ? "إدارة منتجات متجرك" : "Manage your store products"}
            </p>
          </div>
          {isSuperAdmin && (
            <Button onClick={handleAddProduct} className={cn("w-full sm:w-auto")}>
              <Plus className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
              {dictionary.products.addProduct}
            </Button>
          )}
        </div>

        {/* Search - Responsive */}
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
                placeholder={dir === "rtl" ? "البحث في المنتجات..." : "Search products..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn("text-sm sm:text-base px-10")}
              />
              {isNavigating && (
                <Loader2 className={cn("absolute top-2.5 h-4 w-4 text-muted-foreground animate-spin", dir === "rtl" ? "left-3" : "right-3")} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Products Table - Enhanced Responsive */}
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className={cn("text-base sm:text-lg")}>
                {dir === "rtl" ? "قائمة المنتجات" : "Products List"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {dir === "rtl" ? `${totalProducts} منتج` : `${totalProducts} products`} |
                {dir === "rtl" ? ` صفحة ${currentPage} من ${totalPages}` : ` Page ${currentPage} of ${totalPages}`}
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={cn("w-16 sm:w-20")}>
                      {dir === "rtl" ? "الصورة" : "Image"}
                    </TableHead>
                    <TableHead 
                      className={cn("cursor-pointer hover:bg-muted/50 transition-colors")}
                      onClick={() => handleSort('nameEn')}
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
                      onClick={() => handleSort('price')}
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
                            {dir === "rtl" ? "لا توجد منتجات" : "No products found"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id} className="hover:bg-muted/50">
                        <TableCell>
                          {product.images && product.images.length > 0 ? (
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded overflow-hidden">
                              <Image
                                src={product.images[0]}
                                alt={dir === "rtl" ? product.nameAr : product.nameEn}
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
                        <TableCell >
                          <div className="min-w-[120px] sm:min-w-[160px]">
                            <div className="font-medium truncate text-sm sm:text-base">
                              {dir === "rtl" ? product.nameAr : product.nameEn}
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
                        <TableCell className="hidden sm:table-cell">
                          {getStatusBadge(product.status)}
                        </TableCell>
                        <TableCell className={cn("hidden xl:table-cell")}> 
                          <span className="text-sm truncate max-w-[120px] inline-block">
                            {product.category
                              ? product.category.nameAr
                                ? product.category.nameAr
                                : product.category.nameEn
                              : "-"}
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
                              <DropdownMenuItem
                                onClick={() => router.push(`/dashboard/products/${product.id}`)}
                              >
                                <Eye className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                                {dir === "rtl" ? "عرض" : "View"}
                              </DropdownMenuItem>
                              {isSuperAdmin && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
                                  >
                                    <Edit className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                                    {dictionary.common.edit}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setDeleteId(product.id)}
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground order-2 sm:order-1">
                  {dir === "rtl" 
                    ? `عرض ${((currentPage - 1) * limit) + 1}-${Math.min(currentPage * limit, totalProducts)} من ${totalProducts}`
                    : `Showing ${((currentPage - 1) * limit) + 1}-${Math.min(currentPage * limit, totalProducts)} of ${totalProducts}`
                  }
                </p>
                <Pagination className="order-1 sm:order-2">
                  <PaginationContent className="flex-wrap">
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={cn(
                          "cursor-pointer",
                          currentPage === 1 && "pointer-events-none opacity-50"
                        )}
                        aria-disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={cn(
                          "cursor-pointer",
                          currentPage === totalPages && "pointer-events-none opacity-50"
                        )}
                        aria-disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dir === "rtl" ? "تأكيد الحذف" : "Confirm Delete"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dir === "rtl"
                ? "هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء."
                : "Are you sure you want to delete this product? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{dictionary.common.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? dictionary.common.loading : dictionary.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
