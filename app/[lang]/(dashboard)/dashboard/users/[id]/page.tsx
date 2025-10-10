"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { Edit, ArrowLeft, User, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { getUser } from "@/lib/actions/users"
import { cn } from "@/lib/utils"

export default function UserViewPage() {
  const { t, dir } = useI18nStore()
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadUser()
  }, [params.id])

  const loadUser = async () => {
    try {
      const result = await getUser(Number.parseInt(params.id as string))
      if (result.success && result.data) {
        setUser(result.data)
      } else {
        setError(result.error || "User not found")
      }
    } catch (error) {
      setError("Failed to load user")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      // <ProtectedRoute requiredRole="super_admin">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
      // </ProtectedRoute>
    )
  }

  if (error) {
    return (
      // <ProtectedRoute requiredRole="super_admin">
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
          </div>
      // </ProtectedRoute>
    )
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      super_admin: "default",
      viewer: "secondary",
    } as const

    const labels = {
      super_admin: t("users.superAdmin"),
      viewer: t("users.viewer"),
    }

    return <Badge variant={variants[role as keyof typeof variants]}>{labels[role as keyof typeof labels]}</Badge>
  }

  return (
    // <ProtectedRoute requiredRole="super_admin">
        <div className="space-y-6">
          {/* Header */}
          <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
            <div className={cn("flex items-center gap-4", dir === "rtl" && "flex-row-reverse")}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/users")}
                className={cn(dir === "rtl" && "flex-row-reverse")}
              >
                <ArrowLeft className={cn("h-4 w-4", dir === "rtl" ? "ml-2 rotate-180" : "mr-2")} />
                {dir === "rtl" ? "العودة" : "Back"}
              </Button>
              <div className={cn(dir === "rtl" && "text-right")}>
                <h1 className="text-3xl font-bold">{user?.username}</h1>
                <p className="text-muted-foreground">{dir === "rtl" ? "تفاصيل المستخدم" : "User details"}</p>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}
              className={cn(dir === "rtl" && "flex-row-reverse")}
            >
              <Edit className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
              {t("common.edit")}
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* User Avatar & Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className={cn(dir === "rtl" && "text-right")}>
                  {dir === "rtl" ? "المعلومات الأساسية" : "Basic Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={cn("flex items-center gap-4", dir === "rtl" && "flex-row-reverse")}>
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className={cn(dir === "rtl" && "text-right")}>
                    <h3 className="text-xl font-semibold">{user?.username}</h3>
                    <div className="mt-1">{getRoleBadge(user?.role)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className={cn(dir === "rtl" && "text-right")}>
                  {dir === "rtl" ? "معلومات الاتصال" : "Contact Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className={cn(dir === "rtl" && "text-right")}>
                    <p className="text-sm text-muted-foreground">{t("users.email")}</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                {user?.phoneNumber && (
                  <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div className={cn(dir === "rtl" && "text-right")}>
                      <p className="text-sm text-muted-foreground">{t("users.phoneNumber")}</p>
                      <p className="font-medium">{user.phoneNumber}</p>
                    </div>
                  </div>
                )}

                {user?.address && (
                  <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div className={cn(dir === "rtl" && "text-right")}>
                      <p className="text-sm text-muted-foreground">{t("users.address")}</p>
                      <p className="font-medium">{user.address}</p>
                    </div>
                  </div>
                )}

                <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className={cn(dir === "rtl" && "text-right")}>
                    <p className="text-sm text-muted-foreground">{dir === "rtl" ? "تاريخ الإنشاء" : "Created At"}</p>
                    <p className="font-medium">{new Date(user?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className={cn(dir === "rtl" && "text-right")}>
                {dir === "rtl" ? "تفاصيل الحساب" : "Account Details"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("grid gap-4 md:grid-cols-3", dir === "rtl" && "text-right")}>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("users.username")}</label>
                  <p className="text-lg">{user?.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("users.email")}</label>
                  <p className="text-lg">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("users.role")}</label>
                  <div className="mt-1">{getRoleBadge(user?.role)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    // </ProtectedRoute>
  )
}
