"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useI18nStore } from "@/lib/stores/i18n-store"



interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "super_admin" | "viewer"
  fallbackPath?: string
}

export function ProtectedRoute({ children, requiredRole, fallbackPath = "/dashboard" }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore()
  const { t } = useI18nStore()
  const router = useRouter()
  const pathName = usePathname()


  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
      return
    }
    if (!user && pathName.startsWith("/dashboard")) {
      router.push("/signin")
    }
    if (!isLoading && user && requiredRole && user.role !== requiredRole) {
      router.push(fallbackPath)
      return
    }
  }, [user, isLoading, requiredRole, router, fallbackPath])

  if (isLoading) {
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
