"use client"

import { useState } from "react"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/shadcnUI/dialog"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Switch } from "@/components/shadcnUI/switch"
import {
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Download,
  Star,
  Eye,
  X,
  Plus,
  Image as ImageIcon
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/shadcnUI/dropdown-menu"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { deleteGalleryImage, deleteGalleryImageByPublicId, updateGalleryImage } from "@/lib/actions/gallery"
import Image from "next/image"
import { useGalleryStore } from "@/lib/stores/gallery-store";
import { GalleryImage } from "@/lib/stores/gallery-store"
import { GalleryEditForm } from "./gallery-edit-form"

interface GalleryGridProps {
  images: GalleryImage[]
  onImageUpdate: () => void | null // Callback function to handle image updates
}

export function GalleryGrid({ images, onImageUpdate }: GalleryGridProps) {
  const { t } = useI18nStore()
  const { selectedImage, setSelectedImage, editingImage, setEditingImage } = useGalleryStore();
  const [loading, setLoading] = useState<string | null>(null)

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    const loadingKey = `delete-${image.id || image.publicId}`
    setLoading(loadingKey)

    try {
      let response

      // Use database ID if available and it's a valid integer, otherwise use publicId
      if (image.id && typeof image.id === 'number' && Number.isInteger(image.id) && image.id > 0) {
        response = await deleteGalleryImage(image.id)
      } else if (image.publicId) {
        response = await deleteGalleryImageByPublicId(image.publicId)
      } else {
        throw new Error('No valid identifier found for image')
      }

      if (response.success) {
        onImageUpdate()
      } else {
        console.error('Delete failed:', response.error)
        alert(`Failed to delete image: ${response.error}`)
      }
    } catch (err) {
      console.error('Failed to delete image:', err)
      alert('Failed to delete image. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((image: GalleryImage, index) => (
          <Card key={image.id || image.publicId || image.fileName || index} className="group overflow-hidden">
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
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedImage(image)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="secondary">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEdit(image)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyUrl(image.url || "")}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={image.url} download target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(image)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
              {loading === `delete-${image.id}` && (
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
        ))}
      </div>

      {/* Preview Modal */}
      {selectedImage && (
        <Dialog open onOpenChange={() => setSelectedImage(undefined)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedImage.titleEn || selectedImage.fileName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative aspect-video">
                <Image
                  src={selectedImage.url || ""}
                  alt={selectedImage.altTextEn || selectedImage.fileName}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>File Name:</strong> {selectedImage.fileName}
                </div>
                <div>
                  <strong>Size:</strong> {selectedImage.fileSize ? formatFileSize(selectedImage.fileSize) : 'Unknown'}
                </div>
                {selectedImage.width && selectedImage.height && (
                  <div>
                    <strong>Dimensions:</strong> {selectedImage.width}×{selectedImage.height}
                  </div>
                )}
                <div>
                  <strong>Format:</strong> {selectedImage.format?.toUpperCase()}
                </div>
              </div>

              {selectedImage.tags && selectedImage.tags.length > 0 && (
                <div>
                  <strong>Tags:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedImage.tags.map((tag: string) => (
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
      )}

      {/* Edit Modal */}
      {editingImage && (
        <Dialog open={!!editingImage} onOpenChange={(isOpen) => !isOpen && setEditingImage(undefined)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Image</DialogTitle>
              <DialogDescription>
                Update the details for this image.
              </DialogDescription>
            </DialogHeader>
            <GalleryEditForm
              image={editingImage}
              onSuccess={() => {
                setEditingImage(undefined)
                onImageUpdate()
              }}
              onCancel={() => setEditingImage(undefined)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
