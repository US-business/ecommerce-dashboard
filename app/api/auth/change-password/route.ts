import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { comparePasswords, hashPassword } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    const form = await request.formData()
    const currentPassword = String(form.get("currentPassword") || "")
    const newPassword = String(form.get("newPassword") || "")
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 })
    }
    const user = await db.select().from(users).where(eq(users.email, session.user.email)).then(r => r[0])
    if (!user || !user.password) {
      return NextResponse.json({ success: false, error: "No local password set" }, { status: 400 })
    }
    const valid = await comparePasswords(currentPassword, user.password)
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid current password" }, { status: 400 })
    }
    const hashed = await hashPassword(newPassword)
    await db.update(users).set({ password: hashed }).where(eq(users.id, user.id))
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}


