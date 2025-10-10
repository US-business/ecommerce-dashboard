import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { hashPassword } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const email = String(form.get("email") || "").trim().toLowerCase()
    const username = String(form.get("username") || "").trim()
    const password = String(form.get("password") || "")
    const address = String(form.get("address") || "") || null
    const phoneNumber = String(form.get("phoneNumber") || "") || null

    if (!email || !password || !username) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 })
    }

    const existing = await db.select().from(users).where(eq(users.email, email)).then(r => r[0])
    if (existing) {
      return NextResponse.json({ success: false, error: "Email already in use" }, { status: 409 })
    }

    const hashed = await hashPassword(password)
    const [created] = await db.insert(users).values({
      email,
      username,
      password: hashed,
      address: address || undefined,
      phoneNumber: phoneNumber || undefined,
      role: "viewer",
      provider: "email",
      emailVerified: null,
    }).returning()

    return NextResponse.json({ success: true, data: { id: created.id, email: created.email, username: created.username } })
  } catch (e) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}


