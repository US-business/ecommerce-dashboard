"use client"

import { Card, CardContent } from "@/components/shadcnUI/card"
import { GalleryGrid } from "@/components/dashboard/gallery/gallery-grid/gallery-grid"
import { GalleryList } from "@/components/dashboard/gallery/gallery-list/gallery-list"
import { GalleryImage } from "@/lib/stores/gallery-store"

interface GalleryContentProps {
  loading: boolean
  error: string
  viewMode: 'grid' | 'list'
  images: GalleryImage[]
  onImageUpdate: () => void
}

export function GalleryContent({
  loading,
  error,
  viewMode,
  images,
  onImageUpdate
}: GalleryContentProps) {
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
        <CardContent className="p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      {viewMode === 'grid' ? (
        <GalleryGrid
          images={images}
          onImageUpdate={onImageUpdate}
        />
      ) : (
        <GalleryList
          images={images}
          onImageUpdate={onImageUpdate}
        />
      )}
    </>
  )
}
