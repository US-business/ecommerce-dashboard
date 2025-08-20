import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"


const secretKey = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const key = new TextEncoder().encode(secretKey)

export interface SessionPayload {
  userId: number
  username: string
  email: string
  role: "super_admin" | "viewer"
  expiresAt: Date
}

export async function encrypt(payload: SessionPayload) {
  // return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key)

  // Convert expiresAt to ISO string for JWT compatibility
  const jwtPayload = {
    ...payload,
    expiresAt: payload.expiresAt.toISOString(),
  } as Record<string, unknown>
  return await new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key)
}

export async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  })
  
  // return payload as SessionPayload

  // Manually construct SessionPayload to ensure type safety
  const { userId, username, email, role, expiresAt } = payload as Record<string, unknown>
  if (
    typeof userId !== "number" ||
    typeof username !== "string" ||
    typeof email !== "string" ||
    (role !== "super_admin" && role !== "viewer") ||
    (typeof expiresAt !== "string" && !(expiresAt instanceof Date))
  ) {
    throw new Error("Invalid session payload")
  }
  return {
    userId,
    username,
    email,
    role,
    expiresAt: expiresAt instanceof Date ? expiresAt : new Date(expiresAt),
  }
}

export async function createSession(user: {
  id: number
  username: string
  email: string
  role: "super_admin" | "viewer"
}) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session = await encrypt({
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    expiresAt,
  })

  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
}

export async function verifySession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get("session")?.value

  if (!cookie) return null

  try {
    const session = await decrypt(cookie)
    return session
  } catch (error) {
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value
  if (!session) return

  try {
    const parsed = await decrypt(session)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const res = NextResponse.next()
    res.cookies.set({
      name: "session",
      value: await encrypt({ ...parsed, expiresAt }),
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })
    return res
  } catch (error) {
    return NextResponse.next()
  }
}
