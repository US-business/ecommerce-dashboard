"use client"

import { Badge } from "@/components/shadcnUI/badge"
import { Button } from "@/components/shadcnUI/button"
import { X } from "lucide-react"

interface GalleryActiveTagsProps {
  selectedTags: string[]
  onRemoveTag: (tag: string) => void
  onClearAll: () => void
  translations: {
    activeTags: string
    clearAll: string
  }
}

export function GalleryActiveTags({
  selectedTags,
  onRemoveTag,
  onClearAll,
  translations
}: GalleryActiveTagsProps) {
  if (selectedTags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {translations.activeTags}
      </span>
      {selectedTags.map((tag) => (
        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
          {tag}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onRemoveTag(tag)}
          />
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-xs"
      >
        {translations.clearAll}
      </Button>
    </div>
  )
}
