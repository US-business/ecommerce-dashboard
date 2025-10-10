"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Ticket } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCoupons, deleteCoupon } from "@/lib/actions/coupons"

export default function CouponsPage() {
  const { t, dir } = useI18nStore()
  const router = useRouter()
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadCoupons = async () => {
    setLoading(true)
    try {
      const result = await getCoupons(1, 50, search)
      if (result.success && result.data) {
        setCoupons(result.data as any) 
      }
    } catch (error) {
      console.error("Failed to load coupons:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCoupons()
  }, [search])

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const result = await deleteCoupon(deleteId)
      if (result.success) {
        await loadCoupons()
        setDeleteId(null)
      }
    } catch (error) {
      console.error("Failed to delete coupon:", error)
    } finally {
      setDeleting(false)
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"}>
        {isActive ? (dir === "rtl" ? "نشط" : "Active") : dir === "rtl" ? "غير نشط" : "Inactive"}
      </Badge>
    )
  }

  const getDiscountDisplay = (type: string, value: any) => {
    const num = Number.parseFloat(String(value ?? 0)) || 0
    return type === "percentage" ? `${num}%` : `LE ${num.toFixed(2)}`
  }

  const formatDateTime = (d: any) => {
    if (!d) return "—"
    try { return new Date(d as any).toLocaleString() } catch { return "—" }
  }

  return (
    <>
    {/* <ProtectedRoute requiredRole="super_admin"> */}
        <div className="space-y-6">
          {/* Header */}
          <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
            <div className={cn(dir === "rtl" && "text-right")}>
              <h1 className="text-3xl font-bold">{t("coupons.title")}</h1>
              <p className="text-muted-foreground">
                {dir === "rtl" ? "إدارة كوبونات الخصم" : "Manage discount coupons"}
              </p>
            </div>
            <Button
              onClick={() => router.push("/dashboard/coupons/create")}
              className={cn(dir === "rtl" && "flex-row-reverse")}
            >
              <Plus className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
              {t("coupons.addCoupon")}
            </Button>
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
                  placeholder={dir === "rtl" ? "البحث في الكوبونات..." : "Search coupons..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn(dir === "rtl" ? "pr-10 text-right" : "pl-10")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Coupons Table */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "قائمة الكوبونات" : "Coupons List"}
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
                        <TableHead className={cn(dir === "rtl" && "text-right")}>{t("coupons.code")}</TableHead>
                        <TableHead className={cn(dir === "rtl" && "text-right")}>{t("coupons.discountType")}</TableHead>
                        <TableHead className={cn(dir === "rtl" && "text-right")}>
                          {t("coupons.discountValue")}
                        </TableHead>
                        <TableHead className={cn(dir === "rtl" && "text-right")}>
                          {dir === "rtl" ? "بداية الصلاحية" : "Valid From"}
                        </TableHead>
                        <TableHead className={cn(dir === "rtl" && "text-right")}>
                          {dir === "rtl" ? "نهاية الصلاحية" : "Valid To"}
                        </TableHead>
                        <TableHead className={cn(dir === "rtl" && "text-right")}>{t("common.status")}</TableHead>
                        <TableHead className={cn(dir === "rtl" && "text-right")}>
                          {dir === "rtl" ? "تاريخ الإنشاء" : "Created At"}
                        </TableHead>
                        <TableHead className={cn(dir === "rtl" && "text-right")}>{t("common.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {coupons.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            {dir === "rtl" ? "لا توجد كوبونات" : "No coupons found"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        coupons.map((coupon: any) => (
                          <TableRow key={coupon.id}>
                            <TableCell className={cn(dir === "rtl" && "text-right")}>
                              <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
                                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                                  <Ticket className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <code className="font-mono font-semibold">{coupon.code}</code>
                              </div>
                            </TableCell>
                            <TableCell className={cn(dir === "rtl" && "text-right")}>
                              <Badge variant="outline">
                                {coupon.discountType === "fixed" ? t("coupons.fixed") : t("coupons.percentage")}
                              </Badge>
                            </TableCell>
                            <TableCell className={cn(dir === "rtl" && "text-right")}>
                              <span className="font-semibold">
                                {getDiscountDisplay(coupon.discountType, coupon.discountValue)}
                              </span>
                            </TableCell>
                            <TableCell className={cn(dir === "rtl" && "text-right")}>{formatDateTime(coupon.validFrom)}</TableCell>
                            <TableCell className={cn(dir === "rtl" && "text-right")}>{formatDateTime(coupon.validTo)}</TableCell>
                            <TableCell>{getStatusBadge(coupon.isActive)}</TableCell>
                            <TableCell className={cn(dir === "rtl" && "text-right")}>
                              {formatDateTime(coupon.createdAt)}
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
                                    onClick={() => router.push(`/dashboard/coupons/${coupon.id}`)}
                                    className={cn(dir === "rtl" && "flex-row-reverse")}
                                  >
                                    <Eye className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                                    {dir === "rtl" ? "عرض" : "View"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/dashboard/coupons/${coupon.id}/edit`)}
                                    className={cn(dir === "rtl" && "flex-row-reverse")}
                                  >
                                    <Edit className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                                    {t("common.edit")}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setDeleteId(coupon.id)}
                                    className={cn("text-destructive", dir === "rtl" && "flex-row-reverse")}
                                  >
                                    <Trash2 className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                                    {t("common.delete")}
                                  </DropdownMenuItem>
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
                  ? "هل أنت متأكد من حذف هذا الكوبون؟ لا يمكن التراجع عن هذا الإجراء."
                  : "Are you sure you want to delete this coupon? This action cannot be undone."}
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
    {/* </ProtectedRoute> */}
    </>
  )
}
