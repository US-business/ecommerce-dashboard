"use client"

import { Button } from "@/components/shadcnUI/button"
import { CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { X, Filter } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface FilterHeaderProps {
  onClose: () => void
}

export function FilterHeader({ onClose }: FilterHeaderProps) {
  const { t } = useI18nStore()
  
  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" />
          {t('gallery.filters')}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  )
}
