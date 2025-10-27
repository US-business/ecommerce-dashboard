"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcnUI/dialog"
import { Badge } from "@/components/shadcnUI/badge"
import Image from "next/image"
import { GalleryImage } from "@/lib/stores/gallery-store"
import { formatFileSize } from "../../_shared/gallery-utils"

interface ImagePreviewDialogProps {
  image: GalleryImage | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImagePreviewDialog({
  image,
  open,
  onOpenChange,
}: ImagePreviewDialogProps) {
  if (!image) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{image.titleEn || image.fileName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative aspect-video">
            <Image
              src={image.url || ""}
              alt={image.altTextEn || image.fileName}
              fill
              className="object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>File Name:</strong> {image.fileName}
            </div>
            <div>
              <strong>Size:</strong> {image.fileSize ? formatFileSize(image.fileSize) : 'Unknown'}
            </div>
            {image.width && image.height && (
              <div>
                <strong>Dimensions:</strong> {image.width}×{image.height}
              </div>
            )}
            <div>
              <strong>Format:</strong> {image.format?.toUpperCase()}
            </div>
          </div>

          {image.tags && image.tags.length > 0 && (
            <div>
              <strong>Tags:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {image.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
