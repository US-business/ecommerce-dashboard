"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { redirect, useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Alert, AlertDescription } from "@/components/shadcnUI/alert"
import { LanguageToggle } from "@/components/language-toggle"
import { login } from "@/lib/auth/actions"
import { cn } from "@/lib/utils"

export default function SignInPage() {
  const { t, dir } = useI18nStore()
  const { user, isLoading: authLoading, loadUser } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/")
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData(e.currentTarget)
      const result = await login(formData)

      if (result.success) {
        // Refetch user data to update the auth context
        await loadUser()
        // Use replace to prevent back navigation after login
        router.replace("/")
      } else {
        setError(result.error || "Invalid email or password")
      }

    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  // If user is already logged in, show redirecting message
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{dir === "rtl" ? "جاري التوجيه إلى لوحة التحكم..." : "Redirecting to dashboard..."}</p>
        </div>
      </div>
    )
  } 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className={cn("absolute top-4", dir === "rtl" ? "left-4" : "right-4")}>
        <LanguageToggle />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className={cn("space-y-1", dir === "rtl" && "text-right")}>
          <CardTitle className="text-2xl text-center">{t("auth.loginTitle")}</CardTitle>
          <CardDescription className="text-center">{t("auth.loginSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription className={cn(dir === "rtl" && "text-right")}>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className={cn(dir === "rtl" && "text-right block")}>
                {t("auth.email")}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="John@example.com"
                required
                disabled={isLoading}
                className={cn(dir === "rtl" && "text-right")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={cn(dir === "rtl" && "text-right block")}>
                {t("auth.password")}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
                className={cn(dir === "rtl" && "text-right")}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("common.loading") : t("auth.loginButton")}
            </Button>
          </form>

          <div
            className={cn("mt-4 text-sm text-center text-muted-foreground space-y-2", dir === "rtl" && "text-right")}
          >
            <p className="font-medium">{dir === "rtl" ? "بيانات الدخول التجريبية:" : "Demo credentials:"}</p>
            <div className="space-y-1">
              <p>
                <strong>{dir === "rtl" ? "مدير عام:" : "Super Admin:"}</strong>
              </p>
              <p>Email: admin@example.com</p>
              <p>Password: admin123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
