"use client"

import { useState } from "react"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { Checkbox } from "@/components/shadcnUI/checkbox"
import { X, Filter } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface GalleryFiltersProps {
  availableTags: string[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  onClose: () => void
}

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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Tags Section */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Filter by Tags
          </Label>
          
          {/* Search tags */}
          <Input
            placeholder="Search tags..."
            value={searchTags}
            onChange={(e) => setSearchTags(e.target.value)}
            className="mb-3"
          />

          {/* Tag controls */}
          <div className="flex gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAllVisibleTags}
              disabled={filteredTags.length === 0}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllTags}
              disabled={selectedTags.length === 0}
            >
              Clear All
            </Button>
          </div>

          {/* Selected tags */}
          {selectedTags.length > 0 && (
            <div className="mb-3">
              <Label className="text-xs text-gray-600 mb-2 block">
                Selected ({selectedTags.length}):
              </Label>
              <div className="flex flex-wrap gap-1">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="default" className="text-xs">
                    {tag}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => handleTagToggle(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Available tags */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredTags.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                {searchTags ? "No tags found matching your search" : "No tags available"}
              </p>
            ) : (
              filteredTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
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
        </div>

        {/* Future filter options can be added here */}
        {/* 
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Filter by Type
          </Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="featured" />
              <Label htmlFor="featured" className="text-sm">Featured Images</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="default" />
              <Label htmlFor="default" className="text-sm">Default Images</Label>
            </div>
          </div>
        </div>
        */}
      </CardContent>
    </Card>
  )
}
