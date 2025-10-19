"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/stores"
import { useSession } from "next-auth/react"
import { useI18nStore } from "@/lib/stores/i18n-store"



interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "super_admin" | "viewer"
  fallbackPath?: string
}

export function ProtectedRoute({ children, requiredRole, fallbackPath = "/dashboard" }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const { t, lang } = useI18nStore()
  const { status } = useSession()
  const router = useRouter()
  const pathName = usePathname()


  useEffect(() => {
    const localized = `/${lang}/signin`

    const loading = isLoading || status === "loading"
    if (loading) return

    // Redirect to signin if not authenticated
    if (!user) {
      router.push(localized)
      return
    }
    
    // Check role requirement
    if (requiredRole && user.role !== requiredRole) {
      router.push(fallbackPath)
      return
    }
  }, [user, isLoading, status, requiredRole, router, fallbackPath, lang])

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
