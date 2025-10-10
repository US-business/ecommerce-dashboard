"use client"

import { useState, useMemo } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Progress } from "@/components/shadcnUI/progress"
import { Badge } from "@/components/shadcnUI/badge"
import { X, Upload, Plus, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useImageUpload } from "@/hooks/use-image-upload"
import { uploadGalleryImages } from "@/lib/actions/gallery"
import { useGalleryStore } from "@/lib/stores/gallery-store"

type UploadedMap = Record<
   string, // fileName
   { publicId?: string; url?: string; dbId?: number }
>

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

                     {selectedFiles.map((img) => {
                        const isUploaded = !!uploaded[img.fileName]
                        const previewUrl = img.file
                           ? URL.createObjectURL(img.file)
                           : undefined

                        return (
                           <div
                              key={img.fileName}
                              className={cn(
                                 "flex gap-3 p-3 border rounded-md transition-colors",
                                 isUploaded && "bg-green-50 border-green-200",
                                 img.status === "uploading" && "bg-blue-50 border-blue-200"
                              )}
                           >
                              {/* Preview */}
                              <div className="w-24 h-24 shrink-0 rounded-md overflow-hidden bg-muted/40 flex items-center justify-center">
                                 {previewUrl ? (
                                    <img
                                       src={previewUrl}
                                       alt={img.fileName}
                                       className="w-full h-full object-cover"
                                    />
                                 ) : (
                                    <span className="text-xs text-muted-foreground">
                                       No preview
                                    </span>
                                 )}
                              </div>

                              {/* Meta + Status */}
                              <div className="flex-1 min-w-0 space-y-2">
                                 <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm truncate font-medium">
                                       {img.fileName}
                                    </p>

                                    <div className="flex items-center gap-2">
                                       {isUploaded ? (
                                          <Badge variant="default" className="gap-1 bg-green-600">
                                             <CheckCircle2 className="h-3 w-3" />
                                             Uploaded
                                          </Badge>
                                       ) : img.status === "uploading" ? (
                                          <Badge variant="secondary" className="gap-1">
                                             <Loader2 className="h-3 w-3 animate-spin" />
                                             Uploading...
                                          </Badge>
                                       ) : (
                                          <Badge variant="outline">Pending</Badge>
                                       )}

                                       <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6"
                                          onClick={() => removeFile(img.fileName)}
                                          disabled={someUploading}
                                          aria-label="Remove file"
                                       >
                                          <X className="h-4 w-4" />
                                       </Button>
                                    </div>
                                 </div>

                                 {/* Progress */}
                                 {img.status === "uploading" &&
                                    typeof img.progress === "number" && (
                                       <Progress value={img.progress} className="h-2" />
                                    )}

                                 {/* Per-file metadata inputs */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                       <Label className="text-xs">Title (EN)</Label>
                                       <Input
                                          placeholder="Title (EN)"
                                          defaultValue={img.titleEn}
                                          onChange={(e) =>
                                             updateImage(img.fileName, {
                                                titleEn: e.target.value,
                                             })
                                          }
                                          disabled={someUploading}
                                       />
                                    </div>

                                    <div className="space-y-1">
                                       <Label className="text-xs">Title (AR)</Label>
                                       <Input
                                          placeholder="العنوان بالعربية"
                                          defaultValue={img.titleAr}
                                          dir="rtl"
                                          onChange={(e) =>
                                             updateImage(img.fileName, {
                                                titleAr: e.target.value,
                                             })
                                          }
                                          disabled={someUploading}
                                       />
                                    </div>

                                    <div className="space-y-1">
                                       <Label className="text-xs">Alt (EN)</Label>
                                       <Input
                                          placeholder="Alt text (EN)"
                                          defaultValue={img.altTextEn}
                                          onChange={(e) =>
                                             updateImage(img.fileName, {
                                                altTextEn: e.target.value,
                                             })
                                          }
                                          disabled={someUploading}
                                       />
                                    </div>

                                    <div className="space-y-1">
                                       <Label className="text-xs">Alt (AR)</Label>
                                       <Input
                                          placeholder="النص البديل (AR)"
                                          defaultValue={img.altTextAr}
                                          dir="rtl"
                                          onChange={(e) =>
                                             updateImage(img.fileName, {
                                                altTextAr: e.target.value,
                                             })
                                          }
                                          disabled={someUploading}
                                       />
                                    </div>
                                 </div>

                                 {/* Tags */}
                                 <div className="space-y-1">
                                    <Label className="text-xs">Tags</Label>
                                    <Input
                                       placeholder="Add a tag then press Enter"
                                       onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                             e.preventDefault()
                                             const v = e.currentTarget.value.trim()
                                             if (!v) return
                                             const prev = img.tags || []
                                             if (!prev.includes(v)) {
                                                updateImage(img.fileName, {
                                                   tags: [...prev, v],
                                                })
                                             }
                                             e.currentTarget.value = ""
                                          }
                                       }}
                                       disabled={someUploading}
                                    />
                                    <div className="flex flex-wrap gap-2">
                                       {(img.tags || []).map((tag: string) => (
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
                                                      (img.tags || []).filter(
                                                         (t: string) => t !== tag
                                                      )
                                                   updateImage(img.fileName, { tags: next })
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
                                    <label className="flex items-center space-x-2 text-xs">
                                       <input
                                          type="checkbox"
                                          checked={img.isFeatured || false}
                                          onChange={(e) =>
                                             updateImage(img.fileName, {
                                                isFeatured: e.target.checked,
                                             })
                                          }
                                          disabled={someUploading}
                                       />
                                       <span>Featured</span>
                                    </label>

                                    <label className="flex items-center space-x-2 text-xs">
                                       <input
                                          type="checkbox"
                                          checked={img.isDefault || false}
                                          onChange={(e) =>
                                             updateImage(img.fileName, {
                                                isDefault: e.target.checked,
                                             })
                                          }
                                          disabled={someUploading}
                                       />
                                       <span>Default</span>
                                    </label>
                                 </div>
                              </div>
                           </div>
                        )
                     })}

                     {/* أزرار إدارة اللست */}
                     <div className="flex items-center justify-between pt-4 border-t">
                        <Button
                           type="button"
                           variant="ghost"
                           onClick={() => {
                              // امسح كل اللي خلص Upload بس
                              Object.keys(uploaded).forEach((fn) => {
                                 removeFile(fn)
                              })
                              setUploaded({})
                           }}
                           disabled={Object.keys(uploaded).length === 0 || someUploading}
                        >
                           Clear Uploaded ({Object.keys(uploaded).length})
                        </Button>

                        <div className="flex gap-2">
                           <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                 // إزالة كل الملفات المعلقة
                                 removePendingFiles()
                                 setUploaded({})
                                 onCancel?.()
                              }}
                              disabled={someUploading}
                           >
                              Cancel
                           </Button>

                           <Button
                              type="button"
                              onClick={handleUploadAll}
                              disabled={someUploading || filesToUpload.length === 0}
                           >
                              {someUploading ? (
                                 <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                 </>
                              ) : (
                                 <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload {filesToUpload.length} Image{filesToUpload.length !== 1 ? 's' : ''}
                                 </>
                              )}
                           </Button>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="text-sm text-muted-foreground text-center py-8">
                     No files selected yet. Use the dropzone to add files.
                  </div>
               )}
            </div>

            {/* Dropzone */}
            <div
               {...getRootProps()}
               className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors w-full lg:w-96 lg:shrink-0",
                  isDragActive
                     ? "border-primary bg-primary/5"
                     : "border-gray-300 hover:border-gray-400",
                  someUploading && "opacity-50 cursor-not-allowed"
               )}
            >
               <input {...getInputProps()} />
               <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 rounded-full bg-muted/50">
                     <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                     <p className="font-medium text-base">
                        {isDragActive ? "Drop files here" : "Drag & drop files here"}
                     </p>
                     <p className="text-sm text-muted-foreground">
                        or click to select files
                     </p>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                     <p>Accepted formats:</p>
                     <p>JPEG, JPG, PNG, GIF, WebP</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Error Display */}
         {error && (
            <div className="mt-4 p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm flex items-center gap-2">
               <AlertCircle className="h-4 w-4 shrink-0" />
               <span>{error}</span>
               <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setError(null)}
                  className="ml-auto"
               >
                  <X className="h-3 w-3" />
               </Button>
            </div>
         )}

         {/* Upload Summary */}
         {selectedFiles.length > 0 && (
            <div className="mt-4 p-3 rounded-md bg-muted/50 text-sm">
               <div className="flex justify-between items-center">
                  <span>
                     {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                  </span>
                  <span>
                     {Object.keys(uploaded).length} uploaded, {' '}
                     {selectedFiles.filter(img => !uploaded[img.fileName]).length} pending
                  </span>
               </div>
            </div>
         )}
      </form>
   )
}