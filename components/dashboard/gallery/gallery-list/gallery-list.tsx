"use client"

import { useState } from 'react'
import { deleteGalleryImage, deleteGalleryImageByPublicId } from '@/lib/actions/gallery'
import { GalleryImage, useGalleryStore } from "@/lib/stores/gallery-store"
import { useToast } from "@/hooks/use-toast"
import { useI18nStore } from "@/lib/stores/i18n-store"
import {
    GalleryImageCard,
    GalleryEditDialog,
    DeleteConfirmDialog
} from './_components'

interface GalleryListProps {
    images: GalleryImage[]
    onImageUpdate: () => void
}

export function GalleryList({ images, onImageUpdate }: GalleryListProps) {
    const { t } = useI18nStore()
    const { toast } = useToast()
    const { editingImage, setEditingImage } = useGalleryStore()
    const [loading, setLoading] = useState<string | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<GalleryImage | null>(null)

    const handleCopyUrl = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url)
            toast({
                title: "URL copied to clipboard",
                variant: "default",
            })
        } catch (err) {
            console.error('Failed to copy URL:', err)
        }
    }

    const confirmDelete = async () => {
        if (!deleteConfirm) return

        const loadingKey = `delete-${deleteConfirm.id || deleteConfirm.publicId}`
        setLoading(loadingKey)
        
        try {
            let response
            
            // Use database ID if available and it's a valid integer, otherwise use publicId
            if (deleteConfirm.id && typeof deleteConfirm.id === 'number' && Number.isInteger(deleteConfirm.id) && deleteConfirm.id > 0) {
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
                onImageUpdate()
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


    return (
        <>
            <div className="space-y-3">
                {images.map((image: GalleryImage) => (
                    <GalleryImageCard
                        key={image.id || image.publicId}
                        image={image}
                        loading={loading === `delete-${image.id || image.publicId}`}
                        onEdit={(img) => setEditingImage(img)}
                        onDelete={(img) => setDeleteConfirm(img)}
                        onCopyUrl={handleCopyUrl}
                    />
                ))}
            </div>

            <GalleryEditDialog
                image={editingImage}
                onClose={() => setEditingImage(undefined)}
                onSuccess={onImageUpdate}
            />

            <DeleteConfirmDialog
                image={deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={confirmDelete}
                loading={!!loading}
            />
        </>
    )
}
