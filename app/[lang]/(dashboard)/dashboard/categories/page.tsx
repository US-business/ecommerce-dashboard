"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCategories, deleteCategory } from "@/lib/actions/categories"
import { useAuth, useAuthStore } from "@/lib/stores"

interface Category {
  id: number
  nameEn: string
  nameAr: string
  slug: string
  image?: string
  createdAt: Date
}

export default function CategoriesPage() {
  const { t, dir } = useI18nStore()
  const { isSuperAdmin } = useAuthStore()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadCategories = async () => {
    setLoading(true)
    try {
      const result = await getCategories(1, 50, search)
      if (result.success && result.data) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error("Failed to load categories:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [search])

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const result = await deleteCategory(deleteId)
      if (result.success) {
        await loadCategories()
        setDeleteId(null)
      }
    } catch (error) {
      console.error("Failed to delete category:", error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    // <DashboardLayout>
      <>
      <div className="space-y-6">
        {/* Header */}
        <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
          <div className={cn(dir === "rtl" && "text-right")}>
            <h1 className="text-3xl font-bold">{t("categories.title")}</h1>
            <p className="text-muted-foreground">
              {dir === "rtl" ? "إدارة فئات المنتجات" : "Manage product categories"}
            </p>
          </div>
          {isSuperAdmin && (
            <Button
              onClick={() => router.push("/dashboard/categories/create")}
              className={cn(dir === "rtl" && "flex-row-reverse")}
            >
              <Plus className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
              {t("categories.addCategory")}
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
                placeholder={dir === "rtl" ? "البحث في الفئات..." : "Search categories..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(dir === "rtl" ? "pr-10 text-right" : "pl-10")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle className={cn(dir === "rtl" && "text-right")}>
              {dir === "rtl" ? "قائمة الفئات" : "Categories List"}
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
                      <TableHead className={cn(dir === "rtl" && "text-right")}>{t("categories.name")}</TableHead>
                      <TableHead className={cn(dir === "rtl" && "text-right")}>{t("categories.slug")}</TableHead>
                      <TableHead className={cn(dir === "rtl" && "text-right")}>
                        {dir === "rtl" ? "تاريخ الإنشاء" : "Created At"}
                      </TableHead>
                      <TableHead className={cn(dir === "rtl" && "text-right")}>{t("common.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          {dir === "rtl" ? "لا توجد فئات" : "No categories found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            {category.image ? (
                              <img
                                src={category.image || "/placeholder.svg"}
                                alt={dir === "rtl" ? category.nameAr : category.nameEn}
                                className="w-10 h-10 rounded object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className={cn(dir === "rtl" && "text-right")}>
                            <div>
                              <div className="font-medium">{dir === "rtl" ? category.nameAr : category.nameEn}</div>
                              <div className="text-sm text-muted-foreground">
                                {dir === "rtl" ? category.nameEn : category.nameAr}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className={cn(dir === "rtl" && "text-right")}>
                            <code className="text-sm">{category.slug}</code>
                          </TableCell>
                          <TableCell className={cn(dir === "rtl" && "text-right")}>
                            {new Date(category.createdAt).toLocaleDateString()}
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
                                  onClick={() => router.push(`/dashboard/categories/${category.id}`)}
                                  className={cn(dir === "rtl" && "flex-row-reverse")}
                                >
                                  <Eye className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                                  {dir === "rtl" ? "عرض" : "View"}
                                </DropdownMenuItem>
                                {isSuperAdmin && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => router.push(`/dashboard/categories/${category.id}/edit`)}
                                      className={cn(dir === "rtl" && "flex-row-reverse")}
                                    >
                                      <Edit className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                                      {t("common.edit")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => setDeleteId(category.id)}
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
                ? "هل أنت متأكد من حذف هذه الفئة؟ لا يمكن التراجع عن هذا الإجراء."
                : "Are you sure you want to delete this category? This action cannot be undone."}
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
