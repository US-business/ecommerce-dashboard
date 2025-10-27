"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/shadcnUI/dialog"
import { useGalleryStore } from "@/lib/stores/gallery-store"
import { GalleryImage } from "@/lib/stores/gallery-store"
import { GalleryEditForm } from "../gallery-edit-form/gallery-edit-form"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useImageDelete } from "../_shared/use-image-delete"
import { DeleteConfirmationDialog } from "../_shared/delete-confirmation-dialog"
import { copyToClipboard } from "../_shared/gallery-utils"
import { ImageCard } from "./_components/image-card"
import { ImagePreviewDialog } from "./_components/image-preview-dialog"

interface GalleryGridProps {
  images: GalleryImage[]
  onImageUpdate: () => void | null
}

export function GalleryGrid({ images, onImageUpdate }: GalleryGridProps) {
  const { t } = useI18nStore()
  const { selectedImage, setSelectedImage, editingImage, setEditingImage } = useGalleryStore()
  const { loading, deleteConfirm, handleDelete, confirmDelete, cancelDelete } = useImageDelete(onImageUpdate)

  const handleCopyUrl = async (url: string) => {
    await copyToClipboard(url)
  }

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((image: GalleryImage, index) => (
          <ImageCard
            key={image.id || image.publicId || image.fileName || index}
            image={image}
            loading={loading === `delete-${image.id || image.publicId}`}
            onView={() => setSelectedImage(image)}
            onEdit={() => handleEdit(image)}
            onDelete={() => handleDelete(image)}
            onCopyUrl={() => handleCopyUrl(image.url || "")}
          />
        ))}
      </div>

      {/* Preview Modal */}
      <ImagePreviewDialog
        image={selectedImage}
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(undefined)}
      />

      {/* Edit Modal */}
      {editingImage && (
        <Dialog open={!!editingImage} onOpenChange={(isOpen) => !isOpen && setEditingImage(undefined)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t("gallery.editImage")}</DialogTitle>
              <DialogDescription>
                {t("gallery.subtitle")}
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && cancelDelete()}
        onConfirm={confirmDelete}
        loading={!!loading}
      />
    </>
  )
}
