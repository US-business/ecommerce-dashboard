import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config"
import { withRateLimit, RATE_LIMITS } from "@/lib/api"
import { withErrorHandler } from "@/lib/errors"
import { logger } from "@/lib/utils"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

const handler = withErrorHandler(async (request: Request) => {
  // Check authentication
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  logger.info("Image upload request", { userId: session.user?.id })

  const formData = await request.formData()
  const file = formData.get("file") as File
  const folder = (formData.get("folder") as string) || "profiles"

  if (!file) {
    return NextResponse.json(
      { error: "No file provided" },
      { status: 400 }
    )
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only images are allowed" },
      { status: 400 }
    )
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: "File size must be less than 5MB" },
      { status: 400 }
    )
  }

  // Convert file to buffer
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  logger.info("Uploading to Cloudinary", { folder, fileSize: file.size })

  // Upload to Cloudinary
  const uploadResponse = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
        transformation: [
          { width: 400, height: 400, crop: "fill" },
          { quality: "auto:good" },
          { fetch_format: "auto" }
        ],
      },
      (error, result) => {
        if (error) {
          logger.error("Cloudinary upload failed", error)
          reject(error)
        } else {
          logger.info("Image uploaded successfully", { publicId: result?.public_id })
          resolve(result)
        }
      }
    ).end(buffer)
  })

  return NextResponse.json(uploadResponse)
})

// Apply rate limiting
export const POST = withRateLimit(handler, RATE_LIMITS.UPLOAD)