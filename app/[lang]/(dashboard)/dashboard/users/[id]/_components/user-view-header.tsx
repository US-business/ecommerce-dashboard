"use client"

import { useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/shadcnUI/button"
import { Edit, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserViewHeaderProps {
  username: string
  userId: number
}

export function UserViewHeader({ username, userId }: UserViewHeaderProps) {
  const { t, dir } = useI18nStore()
  const router = useRouter()

  return (
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
          <h1 className="text-3xl font-bold">{username}</h1>
          <p className="text-muted-foreground">{dir === "rtl" ? "تفاصيل المستخدم" : "User details"}</p>
        </div>
      </div>
      <Button
        onClick={() => router.push(`/dashboard/users/${userId}/edit`)}
        className={cn(dir === "rtl" && "flex-row-reverse")}
      >
        <Edit className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
        {t("common.edit")}
      </Button>
    </div>
  )
}
