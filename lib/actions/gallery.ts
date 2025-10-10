"use server"

import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth/guards"
import cloudinary from "../cloudinary/cloudinary"
import { galleryImages } from "@/lib/db/schema"
import { db } from "@/lib/db"
import { GalleryImage } from "@/lib/stores/gallery-store"

// export interface GalleryImage {
//     id?: number
//     titleEn?: string | null
//     titleAr?: string | null
//     altTextEn?: string | null
//     altTextAr?: string | null
//     url: string
//     publicId: string
//     fileName: string
//     fileSize: number
//     width?: number | null
//     height?: number | null
//     format?: string | null
//     tags?: string[] | null
//     isFeatured?: boolean | null
//     isDefault?: boolean | null
//     createdAt?: Date | null
//     updatedAt?: Date | null
// }

export interface GalleryResponse {
    success: boolean
    data?: GalleryImage | GalleryImage[]
    error?: string
    total?: number
}

export interface UploadResponse {
    success: boolean
    data?: GalleryImage
    error?: string
}

// Check if database is available
async function isDatabaseAvailable() {
    try {
        await import("@/lib/db")
        await import("@/lib/db/schema")
        return true
    } catch (error) {
        console.warn("Database not available")
        return false
    }
}

// Get all gallery images with pagination and search
export async function getGalleryImagesDB(
    page = 1,
    limit = 20,
    search?: string,
    tags?: string[]
): Promise<GalleryResponse> {
    try {
        await requireAuth()

        const dbAvailable = await isDatabaseAvailable()
        if (!dbAvailable) {
            // Fallback to Cloudinary direct fetch
            return await getCloudinaryImagesAction(page, limit, search)
        }

        try {
            const { db } = await import("@/lib/db")
            const { galleryImages } = await import("@/lib/db/schema")
            const { like, or, and, desc, count, arrayContains } = await import("drizzle-orm")

            const offset = (page - 1) * limit

            // Build search conditions
            const searchConditions: any[] = []

            if (search) {
                searchConditions.push(
                    or(
                        like(galleryImages.titleEn, `%${search}%`),
                        like(galleryImages.titleAr, `%${search}%`),
                        like(galleryImages.fileName, `%${search}%`),
                        like(galleryImages.publicId, `%${search}%`)
                    )
                )
            }

            if (tags && tags.length > 0) {
                tags.forEach(tag => {
                    searchConditions.push(arrayContains(galleryImages.tags, [tag]))
                })
            }

            // Base query
            const baseQuery = db
                .select()
                .from(galleryImages)
                .orderBy(desc(galleryImages.createdAt))
                .limit(limit)
                .offset(offset)

            // Apply search conditions
            const query = searchConditions.length > 0
                ? baseQuery.where(and(...searchConditions))
                : baseQuery

            const result = await query

            // Get total count
            let totalQuery = db.select({ count: count() }).from(galleryImages)
            if (searchConditions.length > 0) {
                totalQuery = totalQuery.where(and(...searchConditions)) as any
            }
            const totalResult = await totalQuery
            const total = totalResult[0].count

            // Map database fields to the flat GalleryImage format
            const mappedImages: GalleryImage[] = result.map((img: any) => ({
                id: img.id,
                url: img.url,
                publicId: img.publicId,
                fileName: img.fileName,
                fileSize: img.fileSize,
                width: img.width,
                height: img.height,
                format: img.format,
                titleEn: img.titleEn || "",
                titleAr: img.titleAr || "",
                altTextEn: img.altTextEn || "",
                altTextAr: img.altTextAr || "",
                tags: img.tags || [],
                isFeatured: img.isFeatured || false,
                isDefault: img.isDefault || false,
                createdAt: img.createdAt,
                updatedAt: img.updatedAt,
            }))

            return {
                success: true,
                data: mappedImages,
                total,
            }
        } catch (dbError) {
            console.warn("Database query failed, falling back to Cloudinary", dbError)
            return await getCloudinaryImagesAction(page, limit, search)
        }
    } catch (error) {
        console.error("Get gallery images error:", error)
        return {
            success: false,
            error: "Failed to fetch gallery images",
        }
    }
}

// Fallback function to get images directly from Cloudinary
export async function getCloudinaryImagesAction(
    page = 1,
    limit = 20,
    search?: string
): Promise<GalleryResponse> {
    try {
        const { v2: cloudinary } = await import('cloudinary')

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        })

        const searchExpression = search
            ? `folder:gallery AND filename:*${search}*`
            : 'folder:gallery'

        const result = await cloudinary.search
            .expression(searchExpression || 'folder:gallery')
            .sort_by('created_at', 'desc')
            .max_results(limit)
            .execute()

        const images: GalleryImage[] = result.resources.map((img: any) => ({
            url: img.secure_url,
            publicId: img.public_id,
            fileName: img.filename || img.public_id,
            fileSize: img.bytes,
            width: img.width,
            height: img.height,
            format: img.format,
        }))

        return {
            success: true,
            data: images,
            total: result.total_count || images.length,
        }
    } catch (error) {
        console.error("Cloudinary fetch error:", error)
        return {
            success: false,
            error: "Failed to fetch images from Cloudinary",
        }
    }
}


// هنا تقوم ب بحفظ الصورة فقط في الداتابيز
export async function uploadGalleryImages(images: GalleryImage[]) {
    try {
        if (!images || images.length === 0) {
            throw new Error("No images provided")
        }

        // نحفظ الصور في الداتابيز - filter only uploaded images with required fields
        const validImages = images.filter(img => img.url && img.publicId)

        if (validImages.length === 0) {
            throw new Error("No valid images to save")
        }

        const insertData = validImages.map((img) => ({
            url: img.url!,
            publicId: img.publicId!,
            fileName: img.fileName,
            fileSize: img.fileSize,
            width: img.width,
            height: img.height,
            format: img.format,
            titleEn: img.titleEn,
            titleAr: img.titleAr,
            altTextEn: img.altTextEn,
            altTextAr: img.altTextAr,
            tags: img.tags,
            isFeatured: img.isFeatured,
            isDefault: img.isDefault,
            createdAt: new Date(),
            updatedAt: new Date(),
        }))

        const saved = await db.insert(galleryImages).values(insertData).returning()

        revalidatePath('/dashboard/gallery')

        return { success: true, data: saved }
    } catch (error) {
        console.error("Error saving gallery images:", error)
        return { success: false, error: "Failed to save images" }
    }
}



// Save image metadata to database
export async function saveImageToDatabase(imageData: GalleryImage): Promise<void> {
    try {
        if (!imageData.url || !imageData.publicId) {
            throw new Error("Missing required fields: url and publicId")
        }

        await db.insert(galleryImages).values({
            url: imageData.url,
            publicId: imageData.publicId,
            fileName: imageData.fileName,
            fileSize: imageData.fileSize,
            width: imageData.width || null,
            height: imageData.height || null,
            format: imageData.format || null,
        })

    } catch (error) {
        console.error("Failed to save image to database:", error)
    }
}

// Update image metadata
export async function updateGalleryImage(
    id: number,
    data: Partial<GalleryImage>
): Promise<GalleryResponse> {
    try {
        await requireAuth()

        const dbAvailable = await isDatabaseAvailable()
        if (!dbAvailable) {
            return {
                success: false,
                error: "Database not available for image updates"
            }
        }

        const { db } = await import("@/lib/db")
        const { galleryImages } = await import("@/lib/db/schema")
        const { eq } = await import("drizzle-orm")

        const { id: imageId, createdAt, updatedAt, ...updatePayload } = data

        const result = await db
            .update(galleryImages)
            .set({
                ...updatePayload,
                updatedAt: new Date(),
            })
            .where(eq(galleryImages.id, id))
            .returning()

        if (result.length === 0) {
            return {
                success: false,
                error: "Image not found"
            }
        }

        revalidatePath('/dashboard/gallery')

        return {
            success: true,
            data: result[0] as GalleryImage
        }
    } catch (error) {
        console.error("Update gallery image error:", error)
        return {
            success: false,
            error: "Failed to update image"
        }
    }
}

// Delete image from gallery and Cloudinary
export async function deleteGalleryImage(id: number): Promise<GalleryResponse> {
    try {
        await requireAuth()

        const dbAvailable = await isDatabaseAvailable()

        let imageToDelete: GalleryImage | null = null

        if (dbAvailable) {
            // Get image details from database
            const { db } = await import("@/lib/db")
            const { galleryImages } = await import("@/lib/db/schema")
            const { eq } = await import("drizzle-orm")

            const result = await db
                .select()
                .from(galleryImages)
                .where(eq(galleryImages.id, id))
                .limit(1)

            if (result.length > 0) {
                imageToDelete = result[0] as GalleryImage
            }
        }

        if (!imageToDelete) {
            return {
                success: false,
                error: "Image not found"
            }
        }

        // Delete from Cloudinary
        try {
            const { v2: cloudinary } = await import('cloudinary')

            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            })

            console.log("Attempting to delete from Cloudinary:", imageToDelete.publicId)
            const result = await cloudinary.uploader.destroy(imageToDelete.publicId as string)
            console.log("Cloudinary delete result:", result)

            if (result.result !== 'ok') {
                console.warn("Cloudinary deletion failed:", result)
            }
        } catch (cloudinaryError) {
            console.error("Failed to delete from Cloudinary:", cloudinaryError)
        }

        // Delete from database
        if (dbAvailable) {
            const { db } = await import("@/lib/db")
            const { galleryImages } = await import("@/lib/db/schema")
            const { eq } = await import("drizzle-orm")

            await db.delete(galleryImages).where(eq(galleryImages.id, id))
        }

        revalidatePath('/dashboard/gallery')

        return {
            success: true,
            data: imageToDelete
        }
    } catch (error) {
        console.error("Delete gallery image error:", error)
        return {
            success: false,
            error: "Failed to delete image"
        }
    }
}

// Delete image by publicId (for Cloudinary-only images)
export async function deleteGalleryImageByPublicId(publicId: string): Promise<GalleryResponse> {
    try {
        await requireAuth()

        // Delete from Cloudinary
        try {
            const { v2: cloudinary } = await import('cloudinary')

            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            })

            console.log("Attempting to delete from Cloudinary by publicId:", publicId)
            console.log("Cloudinary config:", {
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: !!process.env.CLOUDINARY_API_KEY,
                api_secret: !!process.env.CLOUDINARY_API_SECRET
            })

            const result = await cloudinary.uploader.destroy(publicId)
            console.log("Cloudinary delete result:", result)

            if (result.result !== 'ok') {
                throw new Error(`Cloudinary delete failed: ${result.result}`)
            }
        } catch (cloudinaryError) {
            console.error("Failed to delete from Cloudinary:", cloudinaryError)
            return {
                success: false,
                error: "Failed to delete from Cloudinary"
            }
        }

        // Try to delete from database if it exists
        const dbAvailable = await isDatabaseAvailable()
        if (dbAvailable) {
            try {
                const { db } = await import("@/lib/db")
                const { galleryImages } = await import("@/lib/db/schema")
                const { eq } = await import("drizzle-orm")

                await db.delete(galleryImages).where(eq(galleryImages.publicId, publicId))
            } catch (dbError) {
                console.warn("Failed to delete from database:", dbError)
            }
        }

        revalidatePath('/dashboard/gallery')

        return {
            success: true,
            data: { publicId } as any
        }
    } catch (error) {
        console.error("Delete gallery image by publicId error:", error)
        return {
            success: false,
            error: "Failed to delete image"
        }
    }
}

// Get available tags
export async function getGalleryTags(): Promise<GalleryResponse> {
    try {
        await requireAuth()

        const dbAvailable = await isDatabaseAvailable()
        if (!dbAvailable) {
            return {
                success: true,
                data: []
            }
        }

        const { db } = await import("@/lib/db")
        const { galleryImages } = await import("@/lib/db/schema")

        const result = await db
            .select({ tags: galleryImages.tags })
            .from(galleryImages)
            .where(galleryImages.tags.notNull as any)

        // Extract unique tags
        const allTags = result
            .flatMap(row => row.tags || [])
            .filter((tag, index, self) => self.indexOf(tag) === index)
            .sort()

        return {
            success: true,
            data: allTags as any
        }
    } catch (error) {
        console.error("Get gallery tags error:", error)
        return {
            success: false,
            error: "Failed to fetch tags"
        }
    }
}

// Get all images for the gallery component
export async function getAllImagesAction(): Promise<GalleryImage[]> {
    try {
        const response = await getGalleryImagesDB(1, 100) // Fetching up to 100 images
        if (response.success && Array.isArray(response.data)) {
            return response.data
        }
        return []
    } catch (error) {
        console.error("getAllImagesAction error:", error)
        return []
    }
}
