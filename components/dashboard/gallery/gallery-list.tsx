"use client"

import { useState } from 'react'
import { deleteGalleryImage, deleteGalleryImageByPublicId } from '@/lib/actions/gallery'
import { Button } from '@/components/shadcnUI/button'
import { Card, CardContent } from '@/components/shadcnUI/card'
import { Badge } from '@/components/shadcnUI/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/shadcnUI/dialog'
import {
    Eye,
    Download,
    Copy,
    Trash2,
    MoreVertical,
    Calendar,
    FileImage,
    Star,
    Edit
} from 'lucide-react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/shadcnUI/dropdown-menu"
import { GalleryImage, useGalleryStore } from "@/lib/stores/gallery-store"
import { GalleryForm } from "./gallery-form"
import { GalleryEditForm } from './gallery-edit-form'

interface GalleryListProps {
    images: GalleryImage[]
    onImageUpdate: () => void
}

export function GalleryList({ images, onImageUpdate }: GalleryListProps) {
    const { editingImage, setEditingImage } = useGalleryStore()
    const [loading, setLoading] = useState<string | null>(null)

    const handleCopyUrl = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url)
        } catch (err) {
            console.error('Failed to copy URL:', err)
        }
    }

    const handleEdit = (image: GalleryImage) => {
        setEditingImage(image)
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

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatDate = (date: Date | string | null | undefined) => {
        if (!date) return 'Unknown'
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date))
    }


    return (
        <>
            <div className="space-y-3">
                {images.map((image : GalleryImage) => (
                    <Card key={image.id || image.publicId} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                {/* Thumbnail */}
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                        <Image
                                            src={image.url || ""}
                                            alt={image.altTextEn || image.fileName}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-medium text-sm truncate" title={image.titleEn || image.fileName}>
                                                {image.titleEn || image.fileName}
                                            </h3>
                                            {image.titleAr && (
                                                <p className="text-xs text-gray-600 truncate" dir="rtl">
                                                    {image.titleAr}
                                                </p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 ml-4">
                                            {loading === `delete-${image.id}` && (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                            )}

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="sm" variant="ghost">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(image)}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <a href={image.url || ""} target="_blank" rel="noopener noreferrer">
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View
                                                        </a>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleCopyUrl(image.url || "")}>
                                                        <Copy className="h-4 w-4 mr-2" />
                                                        Copy URL
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <a href={image.url || ""} download target="_blank" rel="noopener noreferrer">
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

                                    {/* Details */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs text-gray-500">
                                                {image.fileSize ? formatFileSize(image.fileSize) : 'Size unknown'}
                                            </span>
                                        </div>

                                        {image.width && image.height && (
                                            <div>
                                                {image.width}×{image.height}
                                            </div>
                                        )}

                                        {image.format && (
                                            <div>
                                                {image.format.toUpperCase()}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(image.createdAt)}
                                        </div>
                                    </div>

                                    {/* Badges and Tags */}
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {/* Status badges */}
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

                                        {/* Tags */}
                                        {image.tags && image.tags.length > 0 && (
                                            <>
                                                {image.tags.slice(0, 3).map((tag) => (
                                                    <Badge key={tag} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                                {image.tags.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{image.tags.length - 3} more
                                                    </Badge>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Alt text preview */}
                                    {(image.altTextEn || image.altTextAr) && (
                                        <div className="text-xs text-gray-500">
                                            {image?.createdAt ? formatDistanceToNow(new Date(image?.createdAt), { addSuffix: true }) : 'Unknown date'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

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
