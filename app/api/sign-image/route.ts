import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { folder } = await request.json()
    const timestamp = Math.round(Date.now() / 1000)

    // Parameters to sign
    const paramsToSign = {
      folder: folder || "profiles",
      timestamp,
      transformation: "w_400,h_400,c_fill,q_auto:good,f_auto"
    }

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    )

    return NextResponse.json({ signature, timestamp })

  } catch (error) {
    console.error("Sign error:", error)
    return NextResponse.json(
      { error: "Failed to sign request" },
      { status: 500 }
    )
  }
}