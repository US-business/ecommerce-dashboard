import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import type { NextApiRequest, NextApiResponse } from "next"
import crypto from "crypto"


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Health check endpoint
export async function GET() {
  try {
    const configured = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      configured,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || "Not set",
      apiKeyExists: !!process.env.CLOUDINARY_API_KEY,
      apiSecretExists: !!process.env.CLOUDINARY_API_SECRET,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Health check failed" },
      { status: 500 }
    );
  }
}




export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { folder, public_id } = body;

    const timestamp = Math.round(Date.now() / 1000);

    const paramsToSign: Record<string, string | number> = {
      timestamp,
    };

    if (folder) {
      paramsToSign.folder = folder;
    }

    if (public_id) {
      paramsToSign.public_id = public_id;
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({ signature, timestamp });
  } catch (error) {
    console.error("Error signing upload:", error);
    return NextResponse.json(
      { error: "Failed to sign upload" },
      { status: 500 }
    );
  }
}

