// hooks/use-image-upload.ts
import { uploadWithSignature, CloudinaryUploadResult, uploadToCloudinary } from "@/lib/cloudinary/upload"

export function useImageUpload(folder = "gallery") {
    const handleUpload = async (
        file: File,
        onProgress: (fileName: string, percentage: number) => void
    ) => {
        // const res: CloudinaryUploadResult = await uploadWithSignature(file, {
        const res: CloudinaryUploadResult = await uploadToCloudinary(file, {
            folder,
            onProgress: (pct) => onProgress(file.name, pct),
        })
        return res
    }

    return { handleUpload }
}
