"use client"

import { useState } from "react"
import { deleteGalleryImage, deleteGalleryImageByPublicId } from "@/lib/actions/gallery"
import { useToast } from "@/hooks/use-toast"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { GalleryImage } from "@/lib/stores/gallery-store"

export function useImageDelete(onSuccess?: () => void) {
  const { toast } = useToast()
  const { t } = useI18nStore()
  const [loading, setLoading] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<GalleryImage | null>(null)

  const handleDelete = (image: GalleryImage) => {
    setDeleteConfirm(image)
  }

  const confirmDelete = async () => {
    if (!deleteConfirm) return

    const loadingKey = `delete-${deleteConfirm.id || deleteConfirm.publicId}`
    setLoading(loadingKey)

    try {
      let response

      // Use database ID if available and it's a valid integer, otherwise use publicId
      if (
        deleteConfirm.id &&
        typeof deleteConfirm.id === 'number' &&
        Number.isInteger(deleteConfirm.id) &&
        deleteConfirm.id > 0
      ) {
        response = await deleteGalleryImage(deleteConfirm.id)
      } else if (deleteConfirm.publicId) {
        response = await deleteGalleryImageByPublicId(deleteConfirm.publicId)
      } else {
        throw new Error('No valid identifier found for image')
      }

      if (response.success) {
        toast({
          title: t("gallery.deleteSuccess"),
          variant: "default",
        })
        onSuccess?.()
      } else {
        console.error('Delete failed:', response.error)
        toast({
          title: t("gallery.deleteError"),
          description: response.error,
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error('Failed to delete image:', err)
      toast({
        title: t("gallery.deleteError"),
        description: t("errors.generic"),
        variant: "destructive",
      })
    } finally {
      setLoading(null)
      setDeleteConfirm(null)
    }
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
  }

  return {
    loading,
    deleteConfirm,
    handleDelete,
    confirmDelete,
    cancelDelete,
  }
}
