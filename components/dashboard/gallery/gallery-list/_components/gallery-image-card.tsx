"use client"

import { Button } from '@/components/shadcnUI/button'
import { Card, CardContent } from '@/components/shadcnUI/card'
import { Badge } from '@/components/shadcnUI/badge'
import {
    Eye,
    Download,
    Copy,
    Trash2,
    MoreVertical,
    Calendar,
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
import { GalleryImage } from "@/lib/stores/gallery-store"
import { formatFileSize, formatDate } from './gallery-helpers'
import { useI18nStore } from "@/lib/stores/i18n-store"

interface GalleryImageCardProps {
    image: GalleryImage
    loading: boolean
    onEdit: (image: GalleryImage) => void
    onDelete: (image: GalleryImage) => void
    onCopyUrl: (url: string) => void
}

export function GalleryImageCard({
    image,
    loading,
    onEdit,
    onDelete,
    onCopyUrl
}: GalleryImageCardProps) {
    const { t, dir } = useI18nStore()
    
    return (
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
                                {loading && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                )}

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="sm" variant="ghost">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEdit(image)}>
                                            <Edit className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                                            {t('common.edit')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <a href={image.url || ""} target="_blank" rel="noopener noreferrer">
                                                <Eye className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                                                {t('gallery.view')}
                                            </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onCopyUrl(image.url || "")}>
                                            <Copy className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                                            {t('gallery.copyUrl')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <a href={image.url || ""} download target="_blank" rel="noopener noreferrer">
                                                <Download className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                                                {t('gallery.download')}
                                            </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onDelete(image)}
                                            className="text-red-600"
                                        >
                                            <Trash2 className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                                            {t('common.delete')}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500">
                                    {image.fileSize ? formatFileSize(image.fileSize) : t('gallery.sizeUnknown')}
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
                                    <Star className={`h-3 w-3 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                                    {t('gallery.featured')}
                                </Badge>
                            )}
                            {image.isDefault && (
                                <Badge variant="secondary" className="text-xs">
                                    {t('gallery.default')}
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
                                {image?.createdAt ? formatDistanceToNow(new Date(image?.createdAt), { addSuffix: true }) : t('gallery.unknownDate')}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
