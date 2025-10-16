"use client"

import { Button } from "@/components/shadcnUI/button"
import { cn } from "@/lib/utils"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAppStore } from "@/lib/stores/app-store"
import { useRouter } from "next/navigation"

interface FormActionsProps {
  loading: boolean
  onSubmit: (e: React.FormEvent) => Promise<void>
}

export function FormActions({ loading, onSubmit }: FormActionsProps) {
  const { t, dir } = useI18nStore()
  const { setShowSaveButtonProduct } = useAppStore()
  const router = useRouter()

  const handleCancel = () => {
    setShowSaveButtonProduct(false)
    router.push("/dashboard/products")
  }

  return (
    <div className={cn("flex gap-4", dir === "rtl" && "flex-row-reverse")}>
      <Button type="submit" disabled={loading} onClick={onSubmit}>
        {loading ? t("common.loading") : t("common.save")}
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleCancel} 
        disabled={loading}
      >
        {t("common.cancel")}
      </Button>
    </div>
  )
}
