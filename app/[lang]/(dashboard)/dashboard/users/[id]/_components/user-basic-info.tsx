"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserBasicInfoProps {
  username: string
  role: string
}

export function UserBasicInfo({ username, role }: UserBasicInfoProps) {
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
          {dir === "rtl" ? "المعلومات الأساسية" : "Basic Information"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={cn("flex items-center gap-4", dir === "rtl" && "flex-row-reverse")}>
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className={cn(dir === "rtl" && "text-right")}>
            <h3 className="text-xl font-semibold">{username}</h3>
            <div className="mt-1">{getRoleBadge(role)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
