'use client'

import { Button } from "@/components/shadcnUI/button"
import { Printer } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { cn } from "@/lib/utils"

export default function PrintButton() {
  const { t, dir } = useI18nStore()
  
  return (
    <Button 
      onClick={() => window.print()} 
      className={cn(
        "absolute top-4 no-print",
        dir === "rtl" ? "left-4" : "right-4"
      )}
    >
      <Printer className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
      {t("orders.printInvoice")}
    </Button>
  )
}