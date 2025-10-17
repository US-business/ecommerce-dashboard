"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcnUI/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcnUI/dropdown-menu"
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAllProductsActions, deleteProduct } from "@/lib/actions/products"
import { useAuthStore } from "@/lib/stores/auth-store"

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

export default function ProductsPage() {
  const { t, dir } = useI18nStore()
  const { isSuperAdmin } = useAuthStore()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadProducts = async () => {
    setLoading(true)
    try {
      const result = await getAllProductsActions(1, 50, search)
      if (result.success && result.data) {
        setProducts(result.data)
      }
    } catch (error) {
      console.error("Failed to load products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [search])

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const result = await deleteProduct(deleteId)
      if (result.success) {
        await loadProducts()
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

  return (
    // <DashboardLayout>
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
          <div className={cn(dir === "rtl" && "text-right")}>
            <h1 className="text-3xl font-bold">{t("products.title")}</h1>
            <p className="text-muted-foreground">
              {dir === "rtl" ? "إدارة منتجات متجرك" : "Manage your store products"}
            </p>
          </div>
          {isSuperAdmin && (
            <Button onClick={handleAddProduct} className={cn(dir === "rtl" && "flex-row-reverse")}>
              <Plus className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
              {t("products.addProduct")}
            </Button>
          )}
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className={cn(dir === "rtl" && "text-right")}>{t("common.search")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search
                className={cn("absolute top-2.5 h-4 w-4 text-muted-foreground", dir === "rtl" ? "right-3" : "left-3")}
              />
              <Input
                placeholder={dir === "rtl" ? "البحث في المنتجات..." : "Search products..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(dir === "rtl" ? "pr-10 text-right" : "pl-10")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className={cn(dir === "rtl" && "text-right")}>
              {dir === "rtl" ? "قائمة المنتجات" : "Products List"} : {products.length} 
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={cn(dir === "rtl" && "text-right")}>
                        {dir === "rtl" ? "الصورة" : "Image"}
                      </TableHead>
                      <TableHead className={cn(dir === "rtl" && "text-right")}>{t("products.name")}</TableHead>
                      <TableHead className={cn(dir === "rtl" && "text-right")}>{t("products.sku")}</TableHead>
                      <TableHead className={cn(dir === "rtl" && "text-right")}>{t("products.price")}</TableHead>
                      <TableHead className={cn(dir === "rtl" && "text-right")}>{t("products.quantity")}</TableHead>
                      <TableHead className={cn(dir === "rtl" && "text-right")}>{t("common.status")}</TableHead>
                      <TableHead className={cn(dir === "rtl" && "text-right")}>{t("products.category")}</TableHead>
                      <TableHead className={cn(dir === "rtl" && "text-right")}>{t("common.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          {dir === "rtl" ? "لا توجد منتجات" : "No products found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            {product.images ? (
                              <img
                                src={product?.images[0] || "/placeholder.svg"}
                                alt={dir === "rtl" ? product.nameAr : product.nameEn}
                                className="w-10 h-10 rounded object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                                <Package className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className={cn(dir === "rtl" && "text-right")}>
                            <div>
                              <div className="font-medium truncate w-40">{dir === "rtl" ? product.nameAr : product.nameEn}</div>
                              {product.brand && <div className="text-sm text-muted-foreground">{product.brand}</div>}
                            </div>
                          </TableCell>
                          <TableCell className={cn(dir === "rtl" && "text-right")}>
                            <code className="text-sm">{product.sku}</code>
                          </TableCell>
                          <TableCell className={cn(dir === "rtl" && "text-right")}>${product.price}</TableCell>
                          <TableCell className={cn(dir === "rtl" && "text-right")}>{product.quantityInStock}</TableCell>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell className={cn(dir === "rtl" && "text-right")}>
                            {product.category
                              ? dir === "rtl"
                                ? product.category.nameAr
                                : product.category.nameEn
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
                                <DropdownMenuItem
                                  onClick={() => router.push(`/dashboard/products/${product.id}`)}
                                  className={cn(dir === "rtl" && "flex-row-reverse")}
                                >
                                  <Eye className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                                  {dir === "rtl" ? "عرض" : "View"}
                                </DropdownMenuItem>
                                {isSuperAdmin && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
                                      className={cn(dir === "rtl" && "flex-row-reverse")}
                                    >
                                      <Edit className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                                      {t("common.edit")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => setDeleteId(product.id)}
                                      className={cn("text-destructive", dir === "rtl" && "flex-row-reverse")}
                                    >
                                      <Trash2 className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                                      {t("common.delete")}
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={cn(dir === "rtl" && "text-right")}>
              {dir === "rtl" ? "تأكيد الحذف" : "Confirm Delete"}
            </AlertDialogTitle>
            <AlertDialogDescription className={cn(dir === "rtl" && "text-right")}>
              {dir === "rtl"
                ? "هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء."
                : "Are you sure you want to delete this product? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={cn(dir === "rtl" && "flex-row-reverse")}>
            <AlertDialogCancel disabled={deleting}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? t("common.loading") : t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </>
    // </DashboardLayout>
  )

}
