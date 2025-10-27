"use client"

import { Button } from "@/components/shadcnUI/button"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface TagControlsProps {
  filteredTagsCount: number
  selectedTagsCount: number
  onSelectAll: () => void
  onClearAll: () => void
}

export function TagControls({
  filteredTagsCount,
  selectedTagsCount,
  onSelectAll,
  onClearAll
}: TagControlsProps) {
  const { t } = useI18nStore()
  
  return (
    <div className="flex gap-2 mb-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onSelectAll}
        disabled={filteredTagsCount === 0}
      >
        {t('gallery.selectAll')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onClearAll}
        disabled={selectedTagsCount === 0}
      >
        {t('gallery.clearAll')}
      </Button>
    </div>
  )
}
