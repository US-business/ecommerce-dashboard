"use client"

import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcnUI/select"
import { useI18nStore } from "@/lib/stores"
import { cn } from "@/lib/utils"
import { Search, Filter, Grid, List } from "lucide-react"

interface GallerySearchControlsProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  showFilters: boolean
  onToggleFilters: () => void
  translations: {
    filters: string
    searchPlaceholder: string
    newest: string
    oldest: string
    name: string
    size: string
    grid: string
    list: string
  }
}

export function GallerySearchControls({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  showFilters,
  onToggleFilters,
  translations
}: GallerySearchControlsProps) {
      const {  dir } = useI18nStore()
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleFilters}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        {translations.filters}
      </Button>
      
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={translations.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2 items-center">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{translations.newest}</SelectItem>
            <SelectItem value="oldest">{translations.oldest}</SelectItem>
            <SelectItem value="name">{translations.name}</SelectItem>
            <SelectItem value="size">{translations.size}</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className={cn( dir === 'rtl' ? "rounded-l-none" : "rounded-r-none")}
          >
            <Grid className="h-4 w-4" />
            {translations.grid}
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className={cn( dir === 'rtl' ? "rounded-r-none" : "rounded-l-none")}
          >
            <List className="h-4 w-4" />
            {translations.list}
          </Button>
        </div>
      </div>
    </div>
  )
}
