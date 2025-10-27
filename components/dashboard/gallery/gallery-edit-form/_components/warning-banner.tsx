"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"

interface WarningBannerProps {
  show: boolean
}

export function WarningBanner({ show }: WarningBannerProps) {
  const { t } = useI18nStore()
  
  if (!show) return null

  return (
    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
      {t('gallery.notInDatabase')}
    </div>
  )
}
