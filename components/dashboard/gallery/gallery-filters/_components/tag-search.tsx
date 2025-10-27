"use client"

import { Input } from "@/components/shadcnUI/input"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface TagSearchProps {
  value: string
  onChange: (value: string) => void
}

export function TagSearch({ value, onChange }: TagSearchProps) {
  const { t } = useI18nStore()
  
  return (
    <Input
      placeholder={t('gallery.searchTags')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mb-3"
    />
  )
}
