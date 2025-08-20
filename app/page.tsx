"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/language-toggle"
import { Package } from "lucide-react"
import LoadingPage from "@/components/layout/Loading-page"

export default function HomePage() {
  const { user, isLoading } = useAuthStore()
  const { t } = useI18nStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/")
    }
  }, [user, isLoading, router])



  return (
    <>
      <LoadingPage title="Dashboard" />

      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="absolute top-4 right-4">
          <LanguageToggle />
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Package className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">E-Commerce Dashboard</h1>
            <p className="text-muted-foreground mt-2">Multilingual admin dashboard</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Welcome</CardTitle>
              <CardDescription className="text-center">Please sign in to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" onClick={() => router.push("/signin")}>
                {t("auth.login")}
              </Button>

              <div className="text-sm text-center text-muted-foreground space-y-2">
                <p className="font-medium">Demo credentials:</p>
                <div className="space-y-1">
                  <p>
                    <strong>Super Admin:</strong>
                  </p>
                  <p>Email: admin@example.com</p>
                  <p>Password: admin123</p>
                </div>
                <div className="space-y-1">
                  <p>
                    <strong>Viewer:</strong>
                  </p>
                  <p>Email: viewer@example.com</p>
                  <p>Password: viewer123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
