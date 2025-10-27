// components/dashboard/gallery/gallery-edit-form.tsx
"use client"

import { useState, useEffect } from "react"
import { updateGalleryImage } from "@/lib/actions/gallery"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcnUI/dialog"
import { Edit } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useGalleryStore } from "@/lib/stores/gallery-store"
import { useToast } from "@/hooks/use-toast"
import {
    ImagePreview,
    ImageInfo,
    WarningBanner,
    InputFields,
    TagsManager,
    FeatureToggles,
    FormErrorDisplay,
    FormActions,
    GalleryEditFormProps
} from "./_components"

export function GalleryEditForm({ image, onSuccess, onCancel }: GalleryEditFormProps) {
    const { t } = useI18nStore()
    const { toast } = useToast()
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null) 
    const {
        editingImage,
        setEditingImage,
        updateEditingImage,
    } = useGalleryStore()

    useEffect(() => {
        setEditingImage(image)
        return () => {
            setEditingImage(undefined)
        }
    }, [image, setEditingImage])

    const addTag = (tag: string) => {
        if (!editingImage) return
        const currentTags = editingImage.tags || []
        if (!currentTags.includes(tag)) {
            updateEditingImage({ tags: [...currentTags, tag] })
        }
    }

    const removeTag = (tagToRemove: string) => {
        if (!editingImage) return
        const currentTags = editingImage.tags || []
        updateEditingImage({ tags: currentTags.filter((t) => t !== tagToRemove) })
    }

    const handleSave = async () => {
        setError(null)

        // Important: only allow saving if this image has a DB id
        if (!image.id) {
            setError("This image is not stored in the database and cannot be edited here.")
            return
        }

        try {
            setSaving(true)
            if (!editingImage) {
                setError("No image data to save.")
                return
            }

            const result = await updateGalleryImage(image.id, editingImage)
            if (!result.success) {
                setError(result.error || "Failed to update image in DB.")
                toast({
                    title: t("gallery.updateError"),
                    description: result.error,
                    variant: "destructive",
                })
                return
            }

            toast({
                title: t("gallery.updateSuccess"),
                variant: "default",
            })
            onSuccess()
        } catch (err) {
            console.error(err)
            setError("Failed to save changes. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    const isDbImage = Boolean(image.id)

    return (
        <Dialog open={true} onOpenChange={(open) => { if (!open) onCancel() }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        {t("gallery.editImageDetails")}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <ImagePreview url={image.url || ""} fileName={image.fileName} />

                    <ImageInfo 
                        fileName={image.fileName} 
                        width={image.width} 
                        height={image.height} 
                        fileSize={image.fileSize} 
                    />

                    <WarningBanner show={!isDbImage} />

                    <div className="space-y-4">
                        <InputFields
                            editingImage={editingImage}
                            onUpdate={updateEditingImage}
                            disabled={!isDbImage}
                        />

                        <TagsManager
                            tags={editingImage?.tags || []}
                            onAddTag={addTag}
                            onRemoveTag={removeTag}
                            disabled={!isDbImage}
                        />

                        <FeatureToggles
                            isFeatured={editingImage?.isFeatured || false}
                            isDefault={editingImage?.isDefault || false}
                            onFeaturedChange={(checked) => updateEditingImage({ isFeatured: checked })}
                            onDefaultChange={(checked) => updateEditingImage({ isDefault: checked })}
                            disabled={!isDbImage}
                        />
                    </div>

                    <FormErrorDisplay error={error} />

                    <FormActions
                        onCancel={onCancel}
                        onSave={handleSave}
                        saving={saving}
                        disabled={!isDbImage}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
