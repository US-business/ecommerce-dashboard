"use client"

import { useState, useMemo } from "react"
import { useDropzone } from "react-dropzone"
import { useImageUpload } from "@/hooks/use-image-upload"
import { uploadGalleryImages } from "@/lib/actions/gallery"
import { useGalleryStore } from "@/lib/stores/gallery-store"
import {
   ImagePreviewCard,
   DropzoneArea,
   ErrorDisplay,
   UploadSummary,
   ActionButtons,
   UploadedMap
} from "./_components"

export function GalleryForm({
   onSuccess,
   onCancel
}: {
   onSuccess?: () => void
   onCancel?: () => void
}) {
   const {
      images,
      addFile,
      removeFile,
      updateProgress,
      updateImage,
      updateUploadedImages, // استخدام الدالة الجديدة
      removePendingFiles
   } = useGalleryStore()

   const { handleUpload } = useImageUpload()
   const [error, setError] = useState<string | null>(null)
   const [uploaded, setUploaded] = useState<UploadedMap>({})

   const selectedFiles = useMemo(
      () => images.filter((img) => !!img.file),
      [images]
   )

   const onDrop = (acceptedFiles: File[]) => {
      acceptedFiles.forEach(addFile)
   }

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
      disabled: images.some((i) => i.status === "uploading"),
   })

   // حساب الملفات المتبقية للرفع خارج دالة handleUploadAll
   const filesToUpload = useMemo(() =>
      selectedFiles.filter((img) => img.file && !uploaded[img.fileName]),
      [selectedFiles, uploaded]
   )

   const handleUploadAll = async () => {
      setError(null)

      if (filesToUpload.length === 0) {
         setError("No new files to upload.")
         return
      }

      try {
         // 1. رفع الصور على Cloudinary
         const cloudResults = await Promise.all(
            filesToUpload.map(async (img) => {
               // تحديث الحالة لـ uploading
               updateProgress(img.fileName, 0)
               const result = await handleUpload(img.file!, (fileName, progress) =>
                  updateProgress(fileName, progress)
               )
               return result
            })
         )

         // 2. تحضير البيانات للحفظ في قاعدة البيانات
         const payload = cloudResults.map((res: any, idx: number) => {
            const original = filesToUpload[idx]
            return {
               url: res.secure_url,
               publicId: res.public_id,
               fileName: original.fileName,
               fileSize: original.fileSize,
               width: res.width,
               height: res.height,
               format: res.format,
               titleEn: original.titleEn || "",
               titleAr: original.titleAr || "",
               altTextEn: original.altTextEn || "",
               altTextAr: original.altTextAr || "",
               tags: original.tags || [],
               isFeatured: original.isFeatured || false,
               isDefault: original.isDefault || false,
               }
         })

         // 3. حفظ البيانات في قاعدة البيانات
         const dbResp = await uploadGalleryImages(payload)
         if (!dbResp?.success) {
            throw new Error(dbResp?.error || "Failed to save images in DB.")
         }

         // 4. تحديث الستور مع البيانات المحفوظة
         const dbImages = Array.isArray(dbResp.data) ? dbResp.data : []
         const uploadedImagesWithMetadata = payload.map((p, idx) => ({
            ...p,
            id: dbImages[idx]?.id || undefined,
            status: "uploaded" as const,
            progress: 100
         }))

         // استخدام الدالة الجديدة لتحديث الصور
         updateUploadedImages(uploadedImagesWithMetadata)

         // 5. تحديث حالة الرفع المحلية
         const nextUploaded: UploadedMap = { ...uploaded }
         filesToUpload.forEach((file, idx) => {
            nextUploaded[file.fileName] = {
               publicId: cloudResults[idx].public_id,
               url: cloudResults[idx].secure_url,
               dbId: dbImages[idx]?.id,
            }
         })
         setUploaded(nextUploaded)

         // 6. إزالة الملفات المرفوعة من pending files
         setTimeout(() => {
            removePendingFiles()
         }, 1000) // تأخير قصير للسماح بعرض حالة "uploaded"

         // 7. استدعاء onSuccess
         onSuccess?.()

      } catch (e: any) {
         console.error("Upload error:", e)
         setError(e?.message || "Unexpected error while uploading.")

         // تحديث حالة الخطأ للملفات المتأثرة
         filesToUpload.forEach(file => {
            updateProgress(file.fileName, 0)
            // يمكن إضافة updateImage مع error status هنا
         })
      }
   }

   const someUploading = images.some((i) => i.status === "uploading")

   return (
      <form
         onSubmit={(e) => {
            e.preventDefault()
         }}
         className="py-4"
      >
         <div className="space-y-4 flex gap-4 md:flex-row flex-wrap-reverse">
            {/* قائمة الصور المختارة + الميتاداتا لكل واحدة */}
            <div className="space-y-2 flex flex-1 flex-col">
               {selectedFiles.length > 0 ? (
                  <div className="space-y-3 flex-1">
                     <h4 className="text-sm font-medium">Selected Files ({selectedFiles.length})</h4>

                     {selectedFiles.map((img) => (
                        <ImagePreviewCard
                           key={img.fileName}
                           image={img}
                           isUploaded={!!uploaded[img.fileName]}
                           someUploading={someUploading}
                           onRemove={removeFile}
                           onUpdate={updateImage}
                        />
                     ))}

                     <ActionButtons
                        uploaded={uploaded}
                        someUploading={someUploading}
                        filesToUpload={filesToUpload}
                        onClearUploaded={() => {
                           Object.keys(uploaded).forEach((fn) => {
                              removeFile(fn)
                           })
                           setUploaded({})
                        }}
                        onCancel={() => {
                           removePendingFiles()
                           setUploaded({})
                           onCancel?.()
                        }}
                        onUpload={handleUploadAll}
                     />
                  </div>
               ) : (
                  <div className="text-sm text-muted-foreground text-center py-8">
                     No files selected yet. Use the dropzone to add files.
                  </div>
               )}
            </div>

            <DropzoneArea
               getRootProps={getRootProps}
               getInputProps={getInputProps}
               isDragActive={isDragActive}
               disabled={someUploading}
            />
         </div>

         <ErrorDisplay error={error} onDismiss={() => setError(null)} />

         <UploadSummary selectedFiles={selectedFiles} uploaded={uploaded} />
      </form>
   )
}