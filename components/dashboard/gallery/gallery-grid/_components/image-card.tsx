"use client"

import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { Eye, Star, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { GalleryImage } from "@/lib/stores/gallery-store"
import { formatFileSize } from "../../_shared/gallery-utils"
import { ImageActions } from "./image-actions"

interface ImageCardProps {
  image: GalleryImage
  loading?: boolean
  onView: () => void
  onEdit: () => void
  onDelete: () => void
  onCopyUrl: () => void
}

export function ImageCard({
  image,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onCopyUrl,
}: ImageCardProps) {
  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-square">
        {image.url ? (
          <Image
            src={image.url}
            alt={image.altTextEn || image.fileName || 'Gallery image'}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
            <ImageActions
              image={image}
              onEdit={onEdit}
              onCopyUrl={onCopyUrl}
              onDelete={onDelete}
            />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {image.isFeatured && (
            <Badge variant="default" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {image.isDefault && (
            <Badge variant="secondary" className="text-xs">
              Default
            </Badge>
          )}
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <h3 className="font-medium text-sm truncate" title={image.titleEn || image.fileName}>
          {image.titleEn || image.fileName}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {image.fileSize ? formatFileSize(image.fileSize) : 'Size unknown'}
          {image.width && image.height && (
            <span className="ml-2">{image.width}×{image.height}</span>
          )}
        </p>

        {/* Tags */}
        {image.tags && image.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {image.tags.slice(0, 2).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {image.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{image.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
