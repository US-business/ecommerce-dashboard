"use client"

import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Progress } from "@/components/shadcnUI/progress"
import { Badge } from "@/components/shadcnUI/badge"
import { X, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { GalleryImage } from "@/lib/stores/gallery-store"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface ImagePreviewCardProps {
   image: GalleryImage
   isUploaded: boolean
   someUploading: boolean
   onRemove: (fileName: string) => void
   onUpdate: (fileName: string, updates: Partial<GalleryImage>) => void
}

export function ImagePreviewCard({
   image,
   isUploaded,
   someUploading,
   onRemove,
   onUpdate
}: ImagePreviewCardProps) {
   const { t, dir } = useI18nStore()
   const previewUrl = image.file ? URL.createObjectURL(image.file) : undefined

   return (
      <div
         className={cn(
            "flex gap-3 p-3 border rounded-md transition-colors",
            isUploaded && "bg-green-50 border-green-200",
            image.status === "uploading" && "bg-blue-50 border-blue-200"
         )}
      >
         {/* Preview */}
         <div className="w-24 h-24 shrink-0 rounded-md overflow-hidden bg-muted/40 flex items-center justify-center">
            {previewUrl ? (
               <img
                  src={previewUrl}
                  alt={image.fileName}
                  className="w-full h-full object-cover"
               />
            ) : (
               <span className="text-xs text-muted-foreground">
                  {t('gallery.noPreview')}
               </span>
            )}
         </div>

         {/* Meta + Status */}
         <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between gap-2">
               <p className="text-sm truncate font-medium">
                  {image.fileName}
               </p>

               <div className="flex items-center gap-2">
                  {isUploaded ? (
                     <Badge variant="default" className="gap-1 bg-green-600">
                        <CheckCircle2 className="h-3 w-3" />
                        {t('gallery.uploaded')}
                     </Badge>
                  ) : image.status === "uploading" ? (
                     <Badge variant="secondary" className="gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        {t('gallery.uploading')}
                     </Badge>
                  ) : (
                     <Badge variant="outline">{t('gallery.pending')}</Badge>
                  )}

                  <Button
                     type="button"
                     variant="ghost"
                     size="icon"
                     className="h-6 w-6"
                     onClick={() => onRemove(image.fileName)}
                     disabled={someUploading}
                     aria-label="Remove file"
                  >
                     <X className="h-4 w-4" />
                  </Button>
               </div>
            </div>

            {/* Progress */}
            {image.status === "uploading" &&
               typeof image.progress === "number" && (
                  <Progress value={image.progress} className="h-2" />
               )}

            {/* Per-file metadata inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div className="space-y-1">
                  <Label className="text-xs">{t('gallery.titleEnglish')}</Label>
                  <Input
                     placeholder={t('gallery.titleEnglish')}
                     defaultValue={image.titleEn}
                     onChange={(e) =>
                        onUpdate(image.fileName, {
                           titleEn: e.target.value,
                        })
                     }
                     disabled={someUploading}
                  />
               </div>
               <div className="space-y-1">
                  <Label className="text-xs">{t('gallery.titleArabic')}</Label>
                  <Input
                     placeholder={t('gallery.titleArabic')}
                     defaultValue={image.titleAr}
                     dir="rtl"
                     onChange={(e) =>
                        onUpdate(image.fileName, {
                           titleAr: e.target.value,
                        })
                     }
                     disabled={someUploading}
                  />
               </div>

               <div className="space-y-1">
                  <Label className="text-xs">{t('gallery.altTextEnglish')}</Label>
                  <Input
                     placeholder={t('gallery.altTextEnglish')}
                     defaultValue={image.altTextEn}
                     onChange={(e) =>
                        onUpdate(image.fileName, {
                           altTextEn: e.target.value,
                        })
                     }
                     disabled={someUploading}
                  />
               </div>
               <div className="space-y-1">
                  <Label className="text-xs">{t('gallery.altTextArabic')}</Label>
                  <Input
                     placeholder={t('gallery.altTextArabic')}
                     defaultValue={image.altTextAr}
                     dir="rtl"
                     onChange={(e) =>
                        onUpdate(image.fileName, {
                           altTextAr: e.target.value,
                        })
                     }
                     disabled={someUploading}
                  />
               </div>
            </div>

            {/* Tags */}
            <div className="space-y-1">
               <Label className="text-xs">{t('gallery.tags')}</Label>
               <Input
                  placeholder={t('gallery.addTag')}
                  onKeyDown={(e) => {
                     if (e.key === "Enter") {
                        e.preventDefault()
                        const v = e.currentTarget.value.trim()
                        if (!v) return
                        const prev = image.tags || []
                        if (!prev.includes(v)) {
                           onUpdate(image.fileName, {
                              tags: [...prev, v],
                           })
                        }
                        e.currentTarget.value = ""
                     }
                  }}
                  disabled={someUploading}
               />
               <div className="flex flex-wrap gap-2">
                  {(image.tags || []).map((tag: string) => (
                     <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                     >
                        {tag}
                        <Button
                           type="button"
                           variant="ghost"
                           size="icon"
                           className="h-4 w-4 p-0 hover:bg-transparent"
                           onClick={() => {
                              const next =
                                 (image.tags || []).filter(
                                    (t: string) => t !== tag
                                 )
                              onUpdate(image.fileName, { tags: next })
                           }}
                           disabled={someUploading}
                        >
                           <X className="h-3 w-3" />
                        </Button>
                     </Badge>
                  ))}
               </div>
            </div>

            {/* Featured & Default toggles */}
            <div className="flex gap-4">
               <label className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse' : ''} space-x-2 text-xs`}>
                  <input
                     type="checkbox"
                     checked={image.isFeatured || false}
                     onChange={(e) =>
                        onUpdate(image.fileName, {
                           isFeatured: e.target.checked,
                        })
                     }
                     disabled={someUploading}
                  />
                  <span>{t('gallery.featured')}</span>
               </label>

               <label className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse' : ''} space-x-2 text-xs`}>
                  <input
                     type="checkbox"
                     checked={image.isDefault || false}
                     onChange={(e) =>
                        onUpdate(image.fileName, {
                           isDefault: e.target.checked,
                        })
                     }
                     disabled={someUploading}
                  />
                  <span>{t('gallery.default')}</span>
               </label>
            </div>
         </div>
      </div>
   )
}
