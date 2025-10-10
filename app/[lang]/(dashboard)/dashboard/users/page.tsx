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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { getUsers, deleteUser } from "@/lib/actions/users"

type User = {
  id: number
  username: string
  phoneNumber: string
  email: string
  role: string
  createdAt: string
}


export default function UsersPage() {
  const { t, dir } = useI18nStore()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<User["id"] | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadUsers = async () => {
    setLoading(true)
    try {
      const result = await getUsers(1, 50, search)
      if (result.success && result.data) {
        setUsers(result.data)
      }
    } catch (error) {
      console.error("Failed to load users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [search])

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const result = await deleteUser(deleteId)
      if (result.success) {
        await loadUsers()
        setDeleteId(null)
      }
    } catch (error) {
      console.error("Failed to delete user:", error)
    } finally {
      setDeleting(false)
    }
  }

  const getRoleBadge = (role: User["role"]) => {
    const variants = {
      super_admin: "default",
      viewer: "secondary",
    } as const

    const labels = {
      super_admin: t("users.superAdmin"),
      viewer: t("users.viewer"),
    } as const

    return <Badge variant={variants[role as keyof typeof variants]}>{labels[role as keyof typeof labels]}</Badge>
  }

  return (
    <>
     {/* <ProtectedRoute requiredRole="super_admin"> */}
        <div className="space-y-6">
          {/* Header */}
          <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
            <div className={cn(dir === "rtl" && "text-right")}>
              <h1 className="text-3xl font-bold">{t("users.title")}</h1>
              <p className="text-muted-foreground">{dir === "rtl" ? "إدارة مستخدمي النظام" : "Manage system users"}</p>
            </div>
            <Button
              onClick={() => router.push("/dashboard/users/create")}
              className={cn(dir === "rtl" && "flex-row-reverse")}
            >
              <Plus className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
              {t("users.addUser")}
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
                  placeholder={dir === "rtl" ? "البحث في المستخدمين..." : "Search users..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn(dir === "rtl" ? "pr-10 text-right" : "pl-10")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "قائمة المستخدمين" : "Users List"}
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
                        <TableHead className={cn(dir === "rtl" && "text-right")}>{t("users.username")}</TableHead>
                        <TableHead className={cn(dir === "rtl" && "text-right")}>{t("users.email")}</TableHead>
                        <TableHead className={cn(dir === "rtl" && "text-right")}>{t("users.role")}</TableHead>
                        <TableHead className={cn(dir === "rtl" && "text-right")}>{t("users.phoneNumber")}</TableHead>
                        <TableHead className={cn(dir === "rtl" && "text-right")}>
                          {dir === "rtl" ? "تاريخ الإنشاء" : "Created At"}
                        </TableHead>
                        <TableHead className={cn(dir === "rtl" && "text-right")}>{t("common.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            {dir === "rtl" ? "لا يوجد مستخدمون" : "No users found"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user: User) => (
                          <TableRow key={user.id}>
                            <TableCell className={cn(dir === "rtl" && "text-right")}>
                              <div className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse")}>
                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="font-medium">{user.username}</span>
                              </div>
                            </TableCell>
                            <TableCell className={cn(dir === "rtl" && "text-right")}>{user.email}</TableCell>
                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                            <TableCell className={cn(dir === "rtl" && "text-right")}>
                              {user.phoneNumber || "-"}
                            </TableCell>
                            <TableCell className={cn(dir === "rtl" && "text-right")}>
                              {new Date(user.createdAt).toLocaleDateString()}
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
                                    onClick={() => router.push(`/dashboard/users/${user.id}`)}
                                    className={cn(dir === "rtl" && "flex-row-reverse")}
                                  >
                                    <Eye className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                                    {dir === "rtl" ? "عرض" : "View"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}
                                    className={cn(dir === "rtl" && "flex-row-reverse")}
                                  >
                                    <Edit className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                                    {t("common.edit")}
                                  </DropdownMenuItem>
                                  {user.role !== "super_admin" && (
                                    <DropdownMenuItem
                                      onClick={() => setDeleteId(user.id)}
                                      className={cn("text-destructive", dir === "rtl" && "flex-row-reverse")}
                                    >
                                      <Trash2 className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
                                      {t("common.delete")}
                                    </DropdownMenuItem>
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
                  ? "هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء."
                  : "Are you sure you want to delete this user? This action cannot be undone."}
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
