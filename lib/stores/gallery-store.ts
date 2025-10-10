// lib/stores/gallery-store.ts
import { create } from "zustand"

export interface GalleryImage {
    id?: number
    file?: File
    preview?: string
    url?: string
    publicId?: string
    fileName: string
    fileSize: number
    width?: number
    height?: number
    format?: string
    titleEn?: string
    titleAr?: string
    altTextEn?: string
    altTextAr?: string
    tags?: string[]
    isFeatured?: boolean
    isDefault?: boolean
    timestamp?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    progress?: number
    status?: "pending" | "uploading" | "uploaded" | "error"
    error?: string
}

interface GalleryState {
    images: GalleryImage[]
    editingImage?: GalleryImage
    selectedImage?: GalleryImage
    addFile: (file: File) => void
    addImages: (images: GalleryImage[]) => void
    addImage: (image: GalleryImage) => void
    removeFile: (fileName: string) => void
    removePendingFiles: () => void
    updateProgress: (fileName: string, progress: number) => void
    markUploaded: (fileName: string, url: string, publicId: string) => void
    reset: () => void
    setEditingImage: (image?: GalleryImage) => void
    setSelectedImage: (image?: GalleryImage) => void
    updateEditingImage: (updatedImage: Partial<GalleryImage>) => void
    getEditingImage: () => GalleryImage | undefined
    updateImage: (fileName: string, updatedImage: Partial<GalleryImage>) => void
    // إضافة دالة جديدة لتحديث الصور المرفوعة
    updateUploadedImages: (uploadedImages: GalleryImage[]) => void
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
    images: [],
    editingImage: undefined,
    selectedImage: undefined,

    addFile: (file) =>
        set((state) => ({
            images: [
                ...state.images,
                {
                    file,
                    preview: URL.createObjectURL(file),
                    fileName: file.name,
                    fileSize: file.size,
                    format: file.type,
                    titleEn: "",
                    titleAr: "",
                    altTextEn: "",
                    altTextAr: "",
                    tags: [],
                    isFeatured: false,
                    isDefault: false,
                    timestamp: Date.now(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    status: "pending",
                    progress: 0,
                } as GalleryImage,
            ],
        })),

    // تحديث addImages لحل مشكلة المطابقة
    addImages: (images) =>
        set((state) => {
            // إذا كانت الصور جاية من الداتابيس (load fresh)، استبدل الكل
            if (images.length > 0 && images[0].id) {
                return { images: images }
            }
            
            // وإلا، ادمج مع الموجود
            const imageMap = new Map<string, GalleryImage>()

            // أضف الصور الموجودة أولاً
            state.images.forEach(img => {
                const key = img.publicId || img.fileName
                imageMap.set(key, img)
            })

            // أضف/حدث الصور الجديدة
            images.forEach(newImg => {
                const key = newImg.publicId || newImg.fileName
                const existingImg = imageMap.get(key)
                
                if (existingImg) {
                    // حدث الصورة الموجودة مع الحفاظ على الميتاداتا المحلية
                    imageMap.set(key, {
                        ...existingImg,
                        ...newImg,
                            status: "uploaded"
                    })
                } else {
                    imageMap.set(key, newImg)
                }
            })

            return { images: Array.from(imageMap.values()) }
        }),

    addImage: (image) =>
        set((state) => ({
            images: [...state.images, image],
        })),

    removeFile: (fileName) =>
        set((state) => {
            const img = state.images.find((i) => i.fileName === fileName)
            if (img?.preview) URL.revokeObjectURL(img.preview)
            return { images: state.images.filter((img) => img.fileName !== fileName) }
        }),

    removePendingFiles: () =>
        set((state) => {
            // امسح preview URLs قبل الحذف
            state.images
                .filter(img => img.status === "pending" && img.preview)
                .forEach(img => URL.revokeObjectURL(img.preview!))
            
            return {
                images: state.images.filter((img) => img.status !== "pending"),
            }
        }),

    updateProgress: (fileName, progress) =>
        set((state) => ({
            images: state.images.map((img) => 
                img.fileName === fileName ? { 
                    ...img, 
                    progress,
                    status: progress === 100 ? "uploaded" : "uploading"
                } : img
            ),
        })),

    markUploaded: (fileName, url, publicId) =>
        set((state) => ({
            images: state.images.map((img) =>
                img.fileName === fileName ? { 
                    ...img, 
                    url, 
                    publicId, 
                    status: "uploaded", 
                    progress: 100 
                } : img
            ),
        })),

    // دالة جديدة لتحديث الصور بعد الرفع الناجح
    updateUploadedImages: (uploadedImages) =>
        set((state) => {
            const updatedImages = state.images.map(img => {
                // ابحث عن الصورة المرفوعة المطابقة
                const uploadedImg = uploadedImages.find(uploaded => 
                    uploaded.fileName === img.fileName || 
                    uploaded.publicId === img.publicId
                )
                
                if (uploadedImg) {
                    // احتفظ بالميتاداتا المحلية واضف البيانات الجديدة
                    return {
                        ...img,
                        ...uploadedImg,
                        status: "uploaded" as const,
                        progress: 100
                    }
                }
                return img
            })
            
            return { images: updatedImages }
        }),

    reset: () =>
        set(() => {
            const state = get()
            state.images.forEach((img) => {
                if (img.preview) URL.revokeObjectURL(img.preview)
            })
            return { images: [], editingImage: undefined, selectedImage: undefined }
        }),

    setEditingImage: (image) => set({ editingImage: image }),
    setSelectedImage: (image) => set({ selectedImage: image }),
    updateEditingImage: (updatedImage) =>
        set((state) => ({
            editingImage: state.editingImage ? { 
                ...state.editingImage, 
                ...updatedImage 
            } : undefined,
        })),
    updateImage: (fileName, updatedImage) =>
        set((state) => ({
            images: state.images.map((img) => 
                img.fileName === fileName ? { ...img, ...updatedImage } : img
            ),
        })),
    getEditingImage: () => {
        const s = get()
        return s.editingImage
    },
}))





















