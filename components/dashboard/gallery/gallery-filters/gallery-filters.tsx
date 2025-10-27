"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/shadcnUI/card"
import { Label } from "@/components/shadcnUI/label"
import { useI18nStore } from "@/lib/stores/i18n-store"
import {
  FilterHeader,
  TagSearch,
  TagControls,
  SelectedTagsDisplay,
  AvailableTagsList,
  GalleryFiltersProps
} from "./_components"

export function GalleryFilters({ 
  availableTags, 
  selectedTags, 
  onTagsChange, 
  onClose 
}: GalleryFiltersProps) {
  const { t } = useI18nStore()
  const [searchTags, setSearchTags] = useState("")

  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(searchTags.toLowerCase())
  )

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const clearAllTags = () => {
    onTagsChange([])
  }

  const selectAllVisibleTags = () => {
    const newTags = [...new Set([...selectedTags, ...filteredTags])]
    onTagsChange(newTags)
  }

  return (
    <Card className="w-full">
      <FilterHeader onClose={onClose} />
      
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-3 block">
            {t('gallery.filterByTags')}
          </Label>
          
          <TagSearch 
            value={searchTags} 
            onChange={setSearchTags} 
          />

          <TagControls
            filteredTagsCount={filteredTags.length}
            selectedTagsCount={selectedTags.length}
            onSelectAll={selectAllVisibleTags}
            onClearAll={clearAllTags}
          />

          <SelectedTagsDisplay
            selectedTags={selectedTags}
            onRemoveTag={handleTagToggle}
          />

          <AvailableTagsList
            filteredTags={filteredTags}
            selectedTags={selectedTags}
            searchTags={searchTags}
            onToggleTag={handleTagToggle}
          />
        </div>
      </CardContent>
    </Card>
  )
}
