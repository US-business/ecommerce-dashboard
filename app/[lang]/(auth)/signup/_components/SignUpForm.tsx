"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Button } from "@/components/shadcnUI/button"
import { Alert, AlertDescription } from "@/components/shadcnUI/alert"
import { cn } from "@/lib/utils"
import { SignUpFormFields } from "./SignUpFormFields"
import { SignUpActions } from "./SignUpActions"

interface SignUpFormProps {
  dir: "ltr" | "rtl"
  lang: string
}

export function SignUpForm({ dir, lang }: SignUpFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "viewer" as "viewer",
    address: "",
    phoneNumber: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const validateForm = () => {
    // Validate username
    if (!formData.username.trim()) {
      setError(dir === "rtl" ? "اسم المستخدم مطلوب" : "Username is required")
      return false
    }
    if (formData.username.trim().length < 3) {
      setError(dir === "rtl" ? "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" : "Username must be at least 3 characters")
      return false
    }
    
    // Validate email
    if (!formData.email.trim()) {
      setError(dir === "rtl" ? "البريد الإلكتروني مطلوب" : "Email is required")
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError(dir === "rtl" ? "البريد الإلكتروني غير صالح" : "Invalid email address")
      return false
    }
    
    // Validate password
    if (!formData.password) {
      setError(dir === "rtl" ? "كلمة المرور مطلوبة" : "Password is required")
      return false
    }
    if (formData.password.length < 6) {
      setError(dir === "rtl" ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters")
      return false
    }
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError(dir === "rtl" ? "كلمات المرور غير متطابقة" : "Passwords do not match")
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const body = new FormData()
      body.append("username", formData.username.trim())
      body.append("email", formData.email.trim().toLowerCase())
      body.append("password", formData.password)
      if (formData.address.trim()) body.append("address", formData.address.trim())
      if (formData.phoneNumber.trim()) body.append("phoneNumber", formData.phoneNumber.trim())

      const res = await fetch("/api/auth/register", { method: "POST", body })
      const json = await res.json()
      
      if (!res.ok || !json.success) {
        // Handle different error codes
        if (json.code === "USER_ALREADY_EXISTS") {
          setError(dir === "rtl" ? "البريد الإلكتروني مستخدم بالفعل" : "Email already in use")
        } else if (json.code === "INVALID_EMAIL") {
          setError(dir === "rtl" ? "البريد الإلكتروني غير صالح" : "Invalid email address")
        } else if (json.code === "INVALID_PASSWORD") {
          setError(dir === "rtl" ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters")
        } else if (json.code === "VALIDATION_ERROR") {
          setError(json.error || (dir === "rtl" ? "خطأ في البيانات المدخلة" : "Validation error"))
        } else {
          setError(json.error || (dir === "rtl" ? "فشل إنشاء الحساب" : "Failed to create account"))
        }
      } else {
        // Auto sign-in after successful registration
        const signInResult = await signIn("credentials", { 
          email: formData.email.trim().toLowerCase(), 
          password: formData.password, 
          callbackUrl: `/${lang}`,
          redirect: false
        })
        
        if (signInResult?.ok) {
          router.push(`/${lang}`)
        } else {
          // Registration successful but auto sign-in failed
          setError(dir === "rtl" ? "تم إنشاء الحساب. يرجى تسجيل الدخول." : "Account created. Please sign in.")
          setTimeout(() => router.push(`/${lang}/signin`), 2000)
        }
      }
    } catch (e) {
      setError(dir === "rtl" ? "حدث خطأ أثناء إنشاء الحساب" : "An error occurred while creating account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className={cn("space-y-1", dir === "rtl" && "text-right")}>
        <CardTitle className="text-2xl text-center text-gray-900">
          {dir === "rtl" ? "تسجيل جديد" : "Sign Up"}
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          {dir === "rtl" ? "املأ البيانات التالية لإنشاء حسابك" : "Fill in the details below to create your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription className={cn(dir === "rtl" && "text-right")}>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form Fields */}
          <SignUpFormFields
            formData={formData}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            isLoading={isLoading}
            dir={dir}
            onInputChange={handleInputChange}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{dir === "rtl" ? "جاري الإنشاء..." : "Creating Account..."}</span>
              </div>
            ) : (
              dir === "rtl" ? "إنشاء الحساب" : "Create Account"
            )}
          </Button>
        </form>

        {/* Actions (Google, Shopping, Sign In) */}
        <SignUpActions
          dir={dir}
          lang={lang}
          onContinueShopping={() => router.push(`/${lang}`)}
          onSignIn={() => router.push(`/${lang}/signin`)}
        />
      </CardContent>
    </Card>
  )
}
