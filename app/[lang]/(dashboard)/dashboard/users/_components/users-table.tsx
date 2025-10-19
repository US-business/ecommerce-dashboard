"use client"

import { useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcnUI/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcnUI/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type User = {
  id: number
  username: string
  phoneNumber: string
  email: string
  role: string
  createdAt: string
}

interface UsersTableProps {
  users: User[]
  loading: boolean
  onDeleteClick: (userId: number) => void
}

export function UsersTable({ users, loading, onDeleteClick }: UsersTableProps) {
  const { t, dir } = useI18nStore()
  const router = useRouter()

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
                                onClick={() => onDeleteClick(user.id)}
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
  )
}
