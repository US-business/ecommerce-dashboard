export interface GalleryFiltersProps {
  availableTags: string[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  onClose: () => void
}
