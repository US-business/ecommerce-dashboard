"use client"

import { Checkbox } from "@/components/shadcnUI/checkbox"
import { Label } from "@/components/shadcnUI/label"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface AvailableTagsListProps {
  filteredTags: string[]
  selectedTags: string[]
  searchTags: string
  onToggleTag: (tag: string) => void
}

export function AvailableTagsList({
  filteredTags,
  selectedTags,
  searchTags,
  onToggleTag
}: AvailableTagsListProps) {
  const { t } = useI18nStore()
  
  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {filteredTags.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          {searchTags ? t('gallery.noTagsFound') : t('gallery.noTagsAvailable')}
        </p>
      ) : (
        filteredTags.map((tag) => (
          <div key={tag} className="flex items-center space-x-2">
            <Checkbox
              id={`tag-${tag}`}
              checked={selectedTags.includes(tag)}
              onCheckedChange={() => onToggleTag(tag)}
            />
            <Label
              htmlFor={`tag-${tag}`}
              className="text-sm cursor-pointer flex-1"
            >
              {tag}
            </Label>
          </div>
        ))
      )}
    </div>
  )
}
