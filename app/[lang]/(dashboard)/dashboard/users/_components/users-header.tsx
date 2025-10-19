"use client"

import { useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/shadcnUI/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export function UsersHeader() {
  const { t, dir } = useI18nStore()
  const router = useRouter()

  return (
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
  )
}
