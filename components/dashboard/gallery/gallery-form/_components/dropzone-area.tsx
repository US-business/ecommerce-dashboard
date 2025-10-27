"use client"

import { DropzoneRootProps, DropzoneInputProps } from "react-dropzone"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface DropzoneAreaProps {
   getRootProps: () => DropzoneRootProps
   getInputProps: () => DropzoneInputProps
   isDragActive: boolean
   disabled: boolean
}

export function DropzoneArea({
   getRootProps,
   getInputProps,
   isDragActive,
   disabled
}: DropzoneAreaProps) {
   const { t } = useI18nStore()
   
   return (
      <div
         {...getRootProps()}
         className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors w-full lg:w-96 lg:shrink-0",
            isDragActive
               ? "border-primary bg-primary/5"
               : "border-gray-300 hover:border-gray-400",
            disabled && "opacity-50 cursor-not-allowed"
         )}
      >
         <input {...getInputProps()} />
         <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-4 rounded-full bg-muted/50">
               <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
               <p className="font-medium text-base">
                  {isDragActive ? t('gallery.dropFilesHere') : t('gallery.dragAndDrop')}
               </p>
               <p className="text-sm text-muted-foreground">
                  {t('gallery.orClickToSelect')}
               </p>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
               <p>{t('gallery.acceptedFormats')}</p>
               <p>JPEG, JPG, PNG, GIF, WebP</p>
            </div>
         </div>
      </div>
   )
}
