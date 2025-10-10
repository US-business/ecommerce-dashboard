// components/dashboard/gallery/gallery-edit-form.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/shadcnUI/button"
import { updateGalleryImage } from "@/lib/actions/gallery"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Badge } from "@/components/shadcnUI/badge"
import { Switch } from "@/components/shadcnUI/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcnUI/dialog"
import { Edit, X, Save } from "lucide-react"
import { useI18nStore } from "@/lib/stores/i18n-store"
import Image from "next/image"
import { GalleryImage, useGalleryStore } from "@/lib/stores/gallery-store"

interface Props {
    image: GalleryImage
    onSuccess: () => void
    onCancel: () => void
}

export function GalleryEditForm({ image, onSuccess, onCancel }: Props) {
    const { t } = useI18nStore()
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null) 
    const [newTag, setNewTag] = useState("")

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


    const addTag = () => {
        if (!newTag.trim() || !editingImage) return
        const currentTags = editingImage.tags || []
        if (!currentTags.includes(newTag.trim())) {
            updateEditingImage({ tags: [...currentTags, newTag.trim()] })
            setNewTag("")
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
                return
            }

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
                        Edit Image Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex justify-center">
                        <div className="w-48 h-48 rounded-lg overflow-hidden bg-gray-100">
                            <Image src={image.url || "/placeholder.jpg"} alt={image.fileName} width={192} height={192} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="text-center">
                        <h3 className="font-medium">{image.fileName}</h3>
                        <p className="text-sm text-gray-500">
                            {image.width && image.height && `${image.width} × ${image.height}`}
                            {image.fileSize ? ` • ${(image.fileSize / 1024 / 1024).toFixed(2)} MB` : ""}
                        </p>
                    </div>

                    {!isDbImage && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                            This image is not in the database — editing is only available for images stored in the DB.
                        </div>
                    )}

                    {/* Form fields bound to editingImage metadata */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Title (English)</Label>
                                <Input placeholder="Image title in English" value={editingImage?.titleEn || ""} onChange={(e) => updateEditingImage({ titleEn: e.target.value })} disabled={!isDbImage} />
                            </div>
                            <div>
                                <Label>Title (Arabic)</Label>
                                <Input placeholder="عنوان الصورة بالعربية" value={editingImage?.titleAr || ""} onChange={(e) => updateEditingImage({ titleAr: e.target.value })} dir="rtl" disabled={!isDbImage} />
                            </div>

                            <div>
                                <Label>Alt Text (English)</Label>
                                <Input placeholder="Alt text in English" value={editingImage?.altTextEn || ""} onChange={(e) => updateEditingImage({ altTextEn: e.target.value })} disabled={!isDbImage} />
                            </div>
                            <div>
                                <Label>Alt Text (Arabic)</Label>
                                <Input placeholder="النص البديل بالعربية" value={editingImage?.altTextAr || ""} onChange={(e) => updateEditingImage({ altTextAr: e.target.value })} dir="rtl" disabled={!isDbImage} />
                            </div>
                        </div>

                        <div>
                            <Label>Tags</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {(editingImage?.tags || []).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="flex items-center gap-2">
                                        {tag}
                                        <Button variant="secondary" className="ml-1" onClick={() => removeTag(tag)} disabled={!isDbImage}><X className="h-3 w-3" /></Button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input placeholder="Add tag..." value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }} disabled={!isDbImage} />
                                <Button type="button" variant="outline" onClick={addTag} disabled={!isDbImage}>Add</Button>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex items-center space-x-2">
                                <Switch id="featured" checked={editingImage?.isFeatured || false} onCheckedChange={(checked) => updateEditingImage({ isFeatured: checked })} disabled={!isDbImage} />
                                <Label htmlFor="featured">Featured</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="default" checked={editingImage?.isDefault || false} onCheckedChange={(checked) => updateEditingImage({ isDefault: checked })} disabled={!isDbImage} />
                                <Label htmlFor="default">Default</Label>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onCancel} disabled={saving}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving || !isDbImage} className="flex items-center gap-2">
                            {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Save className="h-4 w-4" />} Save Changes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
