"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcnUI/dialog"
import { Button } from "@/components/shadcnUI/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcnUI/avatar"
import { Progress } from "@/components/shadcnUI/progress"
import { Alert, AlertDescription } from "@/components/shadcnUI/alert"
import { useImageUpload } from "@/hooks/use-image-upload"
import { updateProfileImage } from "@/lib/actions/users"
import { Upload, Camera, X, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfileImageUploadProps {
   isOpen: boolean
   onOpenChange: (open: boolean) => void
   currentImage?: string | null
   username: string
   onImageUpdate: (imageUrl: string) => void
   lang: string
}

export function ProfileImageUpload({
   isOpen,
   onOpenChange,
   currentImage,
   username,
   onImageUpdate,
   lang
}: ProfileImageUploadProps) {
   const [selectedFile, setSelectedFile] = useState<File | null>(null)
   const [previewUrl, setPreviewUrl] = useState<string | null>(null)
   const [uploading, setUploading] = useState(false)
   const [uploadProgress, setUploadProgress] = useState(0)
   const [error, setError] = useState<string | null>(null)
   const [success, setSuccess] = useState(false)

   const { handleUpload } = useImageUpload("profiles")
   const isRTL = lang === "ar"

   // Dictionary for translations
   const dictionary = {
      title: lang === "ar" ? "تحديث صورة البروفايل" : "Update Profile Photo",
      selectImage: lang === "ar" ? "اختر صورة" : "Select Image",
      dragDrop: lang === "ar" ? "اسحب وأفلت الصورة هنا أو انقر للاختيار" : "Drag and drop an image here or click to select",
      supportedFormats: lang === "ar" ? "الصيغ المدعومة: JPG, PNG, GIF" : "Supported formats: JPG, PNG, GIF",
      maxSize: lang === "ar" ? "الحد الأقصى: 5 ميجابايت" : "Max size: 5MB",
      upload: lang === "ar" ? "رفع الصورة" : "Upload Image",
      cancel: lang === "ar" ? "إلغاء" : "Cancel",
      uploading: lang === "ar" ? "جاري الرفع..." : "Uploading...",
      success: lang === "ar" ? "تم تحديث الصورة بنجاح!" : "Profile image updated successfully!",
      error: lang === "ar" ? "حدث خطأ أثناء رفع الصورة" : "Error uploading image",
      fileTooLarge: lang === "ar" ? "الملف كبير جداً. الحد الأقصى 5 ميجابايت" : "File too large. Maximum size is 5MB",
      invalidFormat: lang === "ar" ? "صيغة الملف غير مدعومة" : "Invalid file format"
   }

   const handleFileSelect = (file: File) => {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
         setError(dictionary.fileTooLarge)
         return
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"]
      if (!validTypes.includes(file.type)) {
         setError(dictionary.invalidFormat)
         return
      }

      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError(null)
      setSuccess(false)
   }

   const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
   }

   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const files = Array.from(e.dataTransfer.files)
      const imageFile = files.find(file => file.type.startsWith("image/"))

      if (imageFile) {
         handleFileSelect(imageFile)
      }
   }

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
         handleFileSelect(file)
      }
   }

   const handleUploadClick = async () => {
      if (!selectedFile) return

      setUploading(true)
      setError(null)
      setUploadProgress(0)

      try {
         // Upload to Cloudinary
         const result = await handleUpload(selectedFile, (fileName, progress) => {
            setUploadProgress(progress)
         })
         console.log("image url" , result?.secure_url);
         
         // Update database
         const updateResult = await updateProfileImage(result?.secure_url)

         if (updateResult.success) {
            setSuccess(true)
            onImageUpdate(result?.secure_url || "")

            // Close modal after success
            setTimeout(() => {
               onOpenChange(false)
               handleReset()
            }, 1500)
         } else {
            setError(updateResult.error || dictionary.error)
         }

      } catch (error: any) {
         console.error("Upload error:", error)
         setError(error.message || dictionary.error)
      } finally {
         setUploading(false)
      }
   }

   const handleReset = () => {
      setSelectedFile(null)
      if (previewUrl) {
         URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(null)
      setError(null)
      setSuccess(false)
      setUploadProgress(0)
      setUploading(false)
   }

   const handleClose = () => {
      if (!uploading) {
         onOpenChange(false)
         handleReset()
      }
   }

   const getInitials = (name: string) => {
      return name
         .split(' ')
         .map(word => word.charAt(0))
         .join('')
         .toUpperCase()
         .slice(0, 2)
   }

   return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
         <DialogContent className={cn("max-w-md", isRTL && "rtl")}>
            <DialogHeader className={cn(isRTL && "text-right")}>
               <DialogTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  {dictionary.title}
               </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
               {/* Current Image */}
               <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
                  <Avatar className="h-16 w-16">
                     <AvatarImage
                        src={previewUrl || currentImage || ""}
                        alt={username}
                     />
                     <AvatarFallback className="text-lg">
                        {getInitials(username)}
                     </AvatarFallback>
                  </Avatar>
                  <div className={cn("text-sm text-muted-foreground", isRTL && "text-right")}>
                     {previewUrl ? "صورة جديدة" : "الصورة الحالية"}
                  </div>
               </div>

               {/* File Upload Area */}
               {!selectedFile && (
                  <div
                     className={cn(
                        "border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer",
                        isRTL && "text-right"
                     )}
                     onDragOver={handleDragOver}
                     onDrop={handleDrop}
                     onClick={() => document.getElementById("file-input")?.click()}
                  >
                     <input
                        title={dictionary.uploading}
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="hidden"
                     />

                     <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                     <p className="text-sm font-medium mb-2">
                        {dictionary.dragDrop}
                     </p>
                     <p className="text-xs text-muted-foreground mb-1">
                        {dictionary.supportedFormats}
                     </p>
                     <p className="text-xs text-muted-foreground">
                        {dictionary.maxSize}
                     </p>
                  </div>
               )}

               {/* Selected File Info */}
               {selectedFile && (
                  <div className="space-y-4">
                     <div className={cn("flex items-center gap-3 p-3 bg-muted rounded-lg", isRTL && "flex-row-reverse")}>
                        <div className="flex-1">
                           <p className="text-sm font-medium">{selectedFile.name}</p>
                           <p className="text-xs text-muted-foreground">
                              {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                           </p>
                        </div>
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={handleReset}
                           disabled={uploading}
                        >
                           <X className="h-4 w-4" />
                        </Button>
                     </div>
                  </div>
               )}

               {/* Upload Progress */}
               {uploading && (
                  <div className="space-y-2">
                     <div className={cn("flex justify-between text-sm", isRTL && "flex-row-reverse")}>
                        <span>{dictionary.uploading}</span>
                        <span>{uploadProgress}%</span>
                     </div>
                     <Progress value={uploadProgress} />
                  </div>
               )}

               {/* Error Message */}
               {error && (
                  <Alert variant="destructive">
                     <AlertCircle className="h-4 w-4" />
                     <AlertDescription>{error}</AlertDescription>
                  </Alert>
               )}

               {/* Success Message */}
               {success && (
                  <Alert className="border-green-200 bg-green-50">
                     <CheckCircle2 className="h-4 w-4 text-green-600" />
                     <AlertDescription className="text-green-800">
                        {dictionary.success}
                     </AlertDescription>
                  </Alert>
               )}

               {/* Action Buttons */}
               <div className={cn("flex gap-3", isRTL && "flex-row-reverse")}>
                  <Button
                     onClick={handleClose}
                     variant="outline"
                     disabled={uploading}
                     className="flex-1"
                  >
                     {dictionary.cancel}
                  </Button>
                  <Button
                     onClick={handleUploadClick}
                     disabled={!selectedFile || uploading}
                     className="flex-1"
                  >
                     {uploading ? dictionary.uploading : dictionary.upload}
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   )
}