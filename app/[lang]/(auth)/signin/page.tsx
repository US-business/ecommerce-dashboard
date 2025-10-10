"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAuth } from "@/lib/stores"
import { Button } from "@/components/shadcnUI/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { LanguageToggle } from "@/components/language-toggle"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { cn } from "@/lib/utils"
import { LogIn, ShoppingBag } from "lucide-react"
import { useSession } from "next-auth/react"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { signIn } from "next-auth/react"
import { Alert, AlertDescription } from "@/components/shadcnUI/alert"

export default function SignInPage() {
  const { t, dir } = useI18nStore()
  const params = useParams()
  const lang = (params?.lang as string) || (dir === "rtl" ? "ar" : "en")
  const { user, isLoading: authLoading } = useAuth()
  const { status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState("")

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user && status === "authenticated") {
      router.replace(`/${lang}`)
    }
  }, [user, authLoading, status, router, lang])

  // Show loading while checking auth status
  if (authLoading || status === "loading") {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className={cn("absolute top-4", dir === "rtl" ? "left-4" : "right-4")}>
        <LanguageToggle />
      </div>

      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {dir === "rtl" ? "مرحباً بعودتك" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {dir === "rtl" ? "سجل دخولك للوصول إلى حسابك" : "Sign in to access your account"}
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className={cn("space-y-1", dir === "rtl" && "text-right")}>
            <CardTitle className="text-2xl text-center text-gray-900">
              {t("auth.loginTitle")}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {t("auth.loginSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Email / Password Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setIsLoading(true)
                setError("")
                // Note: remember is honored globally via maxAge (30 days)
                const res = await signIn("credentials", {
                  email,
                  password,
                  callbackUrl: `/${lang}`,
                  redirect: true,
                })
                if (!res || (res as any).error) {
                  setError(dir === "rtl" ? "بيانات الدخول غير صحيحة" : "Invalid credentials")
                  setIsLoading(false)
                }
              }}
              className="space-y-4"
            >
              {error && (
                <Alert variant="destructive">
                  <AlertDescription className={cn(dir === "rtl" && "text-right")}>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className={cn("text-sm font-medium", dir === "rtl" && "text-right block")}>{t("auth.email")}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className={cn("text-sm font-medium", dir === "rtl" && "text-right block")}>{t("auth.password")}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
              </div>
              <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}> 
                <label className={cn("flex items-center gap-2 text-sm", dir === "rtl" && "flex-row-reverse")}> 
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  <span>{dir === "rtl" ? "تذكرني" : "Remember me"}</span>
                </label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("common.loading") : t("auth.loginButton")}
              </Button>
            </form>

            {/* Google Sign In Button */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">
                  {dir === "rtl" ? "أو" : "Or"}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <GoogleSignInButton 
                isLoading={isLoading}
                disabled={isLoading}
                callbackUrl={`/${lang}`}
              />
            </div>

            {/* Continue Shopping Button */}
            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/${lang}`)}
                className={cn("w-full flex items-center justify-center gap-2", dir === "rtl" && "flex-row-reverse")}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{dir === "rtl" ? "متابعة التسوق بدون تسجيل دخول" : "Continue Shopping Without Login"}</span>
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className={cn("mt-6 text-center", dir === "rtl" && "text-right")}>
              <p className="text-sm text-gray-600">
                {dir === "rtl" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => router.push(`/${lang}/signup`)}
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {dir === "rtl" ? "إنشاء حساب جديد" : "Sign Up"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
