"use client"

import { Card, CardContent } from "@/components/shadcnUI/card"

interface GalleryStatsProps {
  totalImages: number
  totalTags: number
  featuredCount: number
  translations: {
    totalImages: string
    availableTags: string
    featuredImages: string
  }
}

export function GalleryStats({ 
  totalImages, 
  totalTags, 
  featuredCount, 
  translations 
}: GalleryStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">{totalImages}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {translations.totalImages}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">{totalTags}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {translations.availableTags}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {featuredCount}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {translations.featuredImages}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
