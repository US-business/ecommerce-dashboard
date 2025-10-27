"use client"

import { Badge } from "@/components/shadcnUI/badge"
import { Label } from "@/components/shadcnUI/label"
import { X } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface SelectedTagsDisplayProps {
  selectedTags: string[]
  onRemoveTag: (tag: string) => void
}

export function SelectedTagsDisplay({
  selectedTags,
  onRemoveTag
}: SelectedTagsDisplayProps) {
  const { t } = useI18nStore()
  
  if (selectedTags.length === 0) return null

  return (
    <div className="mb-3">
      <Label className="text-xs text-gray-600 mb-2 block">
        {t('gallery.selected')} ({selectedTags.length}):
      </Label>
      <div className="flex flex-wrap gap-1">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="default" className="text-xs">
            {tag}
            <X
              className="h-3 w-3 ml-1 cursor-pointer"
              onClick={() => onRemoveTag(tag)}
            />
          </Badge>
        ))}
      </div>
    </div>
  )
}
