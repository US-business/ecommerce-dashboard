"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { cn } from "@/lib/utils"

interface UserAccountDetailsProps {
  username: string
  email: string
  role: string
}

export function UserAccountDetails({ username, email, role }: UserAccountDetailsProps) {
  const { t, dir } = useI18nStore()

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
            <p className="text-lg">{username}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("users.email")}</label>
            <p className="text-lg">{email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("users.role")}</label>
            <div className="mt-1">{getRoleBadge(role)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
