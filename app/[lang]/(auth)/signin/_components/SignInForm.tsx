"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Button } from "@/components/shadcnUI/button"
import { Alert, AlertDescription } from "@/components/shadcnUI/alert"
import { cn } from "@/lib/utils"
import { SignInFormFields } from "./SignInFormFields"
import { SignInDivider } from "./SignInDivider"
import { SignInActions } from "./SignInActions"

interface SignInFormProps {
  dir: "ltr" | "rtl"
  lang: string
  t: (key: string) => string
}

export function SignInForm({ dir, lang, t }: SignInFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }))
    if (error) setError("")
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }))
    if (error) setError("")
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setFieldErrors({})

    // Client-side validation
    const errors: { email?: string; password?: string } = {}
    
    if (!email.trim()) {
      errors.email = dir === "rtl" ? "البريد الإلكتروني مطلوب" : "Email is required"
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      errors.email = dir === "rtl" ? "البريد الإلكتروني غير صالح" : "Invalid email address"
    }
    
    if (!password) {
      errors.password = dir === "rtl" ? "كلمة المرور مطلوبة" : "Password is required"
    }
    
    if (password && password.length < 6) {
      errors.password = dir === "rtl" ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters"
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setIsLoading(false)
      return
    }

    try {
      // Note: remember is honored globally via maxAge (30 days)
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        callbackUrl: `/${lang}`,
        redirect: false,
      })
      
      if (res?.error) {
        setError(
          dir === "rtl" 
            ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" 
            : "Invalid email or password"
        )
      } else if (res?.ok) {
        router.push(`/${lang}`)
      }
    } catch (err) {
      setError(
        dir === "rtl" 
          ? "حدث خطأ أثناء تسجيل الدخول" 
          : "An error occurred during sign in"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription className={cn(dir === "rtl" && "text-right")}>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Form Fields */}
          <SignInFormFields
            email={email}
            password={password}
            isLoading={isLoading}
            fieldErrors={fieldErrors}
            dir={dir}
            t={t}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
          />

          {/* Remember Me */}
          <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}> 
            <label className={cn("flex items-center gap-2 text-sm", dir === "rtl" && "flex-row-reverse")}> 
              <input 
                type="checkbox" 
                checked={remember} 
                onChange={(e) => setRemember(e.target.checked)} 
              />
              <span>{dir === "rtl" ? "تذكرني" : "Remember me"}</span>
            </label>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("common.loading") : t("auth.loginButton")}
          </Button>
        </form>

        {/* Divider */}
        <SignInDivider dir={dir} />

        {/* Actions (Google, Continue Shopping, Sign Up) */}
        <SignInActions
          isLoading={isLoading}
          dir={dir}
          lang={lang}
          onContinueShopping={() => router.push(`/${lang}`)}
          onSignUp={() => router.push(`/${lang}/signup`)}
        />
      </CardContent>
    </Card>
  )
}
