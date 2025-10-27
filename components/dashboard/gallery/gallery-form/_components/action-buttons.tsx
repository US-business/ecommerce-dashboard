"use client"

import { Button } from "@/components/shadcnUI/button"
import { Upload, Loader2 } from "lucide-react"
import { UploadedMap } from "./types"
import { GalleryImage } from "@/lib/stores/gallery-store"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface ActionButtonsProps {
   uploaded: UploadedMap
   someUploading: boolean
   filesToUpload: GalleryImage[]
   onClearUploaded: () => void
   onCancel: () => void
   onUpload: () => void
}

export function ActionButtons({
   uploaded,
   someUploading,
   filesToUpload,
   onClearUploaded,
   onCancel,
   onUpload
}: ActionButtonsProps) {
   const { t, dir } = useI18nStore()
   
   return (
      <div className="flex items-center justify-between pt-4 border-t">
         <Button
            type="button"
            variant="ghost"
            onClick={onClearUploaded}
            disabled={Object.keys(uploaded).length === 0 || someUploading}
         >
            {t('gallery.clearUploaded')} ({Object.keys(uploaded).length})
         </Button>

         <div className="flex gap-2">
            <Button
               type="button"
               variant="outline"
               onClick={onCancel}
               disabled={someUploading}
            >
               {t('common.cancel')}
            </Button>

            <Button
               type="button"
               onClick={onUpload}
               disabled={someUploading || filesToUpload.length === 0}
            >
               {someUploading ? (
                  <>
                     <Loader2 className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />
                     {t('gallery.uploading')}
                  </>
               ) : (
                  <>
                     <Upload className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                     {filesToUpload.length === 1 ? t('gallery.uploadMultiple').replace('{count}', '1') : t('gallery.uploadMultiplePlural').replace('{count}', filesToUpload.length.toString())}
                  </>
               )}
            </Button>
         </div>
      </div>
   )
}
