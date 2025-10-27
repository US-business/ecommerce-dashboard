"use client"

import { UploadedMap } from "./types"
import { GalleryImage } from "@/lib/stores/gallery-store"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface UploadSummaryProps {
   selectedFiles: GalleryImage[]
   uploaded: UploadedMap
}

export function UploadSummary({ selectedFiles, uploaded }: UploadSummaryProps) {
   const { t } = useI18nStore()
   
   if (selectedFiles.length === 0) return null

   return (
      <div className="mt-4 p-3 rounded-md bg-muted/50 text-sm">
         <div className="flex justify-between items-center">
            <span>
               {selectedFiles.length} {selectedFiles.length === 1 ? t('gallery.image') : t('gallery.totalImages')}
            </span>
            <span>
               {t('gallery.imagesUploaded').replace('{count}', Object.keys(uploaded).length.toString())}, {t('gallery.imagesPending').replace('{count}', selectedFiles.filter(img => !uploaded[img.fileName]).length.toString())}
            </span>
         </div>
      </div>
   )
}
