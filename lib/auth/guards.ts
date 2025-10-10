import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect(`/ar/signin`)
  }
  return session
}

export async function requireSuperAdmin() {
  const session = await requireAuth()
  if (session.user.role !== "super_admin") {
    redirect(`/ar`)
  }
  return session
}

export async function getNextAuthUser() {
  const session = await getServerSession(authOptions)
  return session?.user ?? null
}


