"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAuth } from "@/lib/stores"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Alert, AlertDescription } from "@/components/shadcnUI/alert"
import { LanguageToggle } from "@/components/language-toggle"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, User, Mail, Lock, MapPin, Phone, UserCheck, ShoppingBag } from "lucide-react"
import { signIn } from "next-auth/react"

export default function SignUpPage() {
    const { t, dir } = useI18nStore()
    const params = useParams()
    const lang = (params?.lang as string) || (dir === "rtl" ? "ar" : "en")
    const { user, isLoading: authLoading } = useAuth()
    const { status } = useSession()
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
        role: "viewer" as "viewer", // Only regular users can sign up
        address: "",
        phoneNumber: ""
    })

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user && status === "authenticated") {
            router.replace(`/${lang}`)
        }
    }, [user, authLoading, status, router, lang])

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (error) setError("")
    }

    const validateForm = () => {
        if (!formData.username.trim()) {
            setError(dir === "rtl" ? "اسم المستخدم مطلوب" : "Username is required")
            return false
        }
        if (!formData.email.trim()) {
            setError(dir === "rtl" ? "البريد الإلكتروني مطلوب" : "Email is required")
            return false
        }
        if (!formData.password) {
            setError(dir === "rtl" ? "كلمة المرور مطلوبة" : "Password is required")
            return false
        }
        if (formData.password.length < 6) {
            setError(dir === "rtl" ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters")
            return false
        }
        if (formData.password !== formData.confirmPassword) {
            setError(dir === "rtl" ? "كلمات المرور غير متطابقة" : "Passwords do not match")
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        if (!validateForm()) {
            setIsLoading(false)
            return
        }

        try {
            const body = new FormData()
            body.append("username", formData.username)
            body.append("email", formData.email)
            body.append("password", formData.password)
            if (formData.address) body.append("address", formData.address)
            if (formData.phoneNumber) body.append("phoneNumber", formData.phoneNumber)

            const res = await fetch("/api/auth/register", { method: "POST", body })
            const json = await res.json()
            if (!res.ok || !json.success) {
                setError(json.error || (dir === "rtl" ? "البريد الإلكتروني مستخدم بالفعل" : "Email already in use"))
            } else {
                // Auto sign-in after successful registration
                await signIn("credentials", { email: formData.email, password: formData.password, callbackUrl: `/${lang}` })
            }
        } catch (e) {
            setError(dir === "rtl" ? "تعذّر إنشاء الحساب" : "Failed to create account")
        } finally {
            setIsLoading(false)
        }
    }

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
                    <p>{dir === "rtl" ? "جاري التوجيه..." : "Redirecting..."}</p>
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
                        <UserCheck className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        {dir === "rtl" ? "إنشاء حساب جديد" : "Create New Account"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {dir === "rtl" ? "انضم إلينا اليوم واستمتع بتجربة تسوق رائعة" : "Join us today and enjoy a great shopping experience"}
                    </p>
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-700">
                            {dir === "rtl" 
                                ? "سيتم إنشاء حساب كمستخدم عادي. يمكن للمديرين إنشاء حسابات إدارية من لوحة التحكم." 
                                : "Your account will be created as a regular user. Admin accounts can be created from the dashboard."
                            }
                        </p>
                    </div>
                </div>

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
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription className={cn(dir === "rtl" && "text-right")}>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Username */}
                            <div className="space-y-2">
                                <Label htmlFor="username" className={cn("text-sm font-medium text-gray-700", dir === "rtl" && "text-right block")}>
                                    {dir === "rtl" ? "اسم المستخدم" : "Username"}
                                </Label>
                                <div className="relative">
                                    <User className={cn("absolute top-3 h-4 w-4 text-gray-400", dir === "rtl" ? "right-3" : "left-3")} />
                                    <Input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder={dir === "rtl" ? "أدخل اسم المستخدم" : "Enter your username"}
                                        required
                                        disabled={isLoading}
                                        value={formData.username}
                                        onChange={(e) => handleInputChange("username", e.target.value)}
                                        className={cn("pl-10", dir === "rtl" && "pr-10 pl-3 text-right")}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className={cn("text-sm font-medium text-gray-700", dir === "rtl" && "text-right block")}>
                                    {dir === "rtl" ? "البريد الإلكتروني" : "Email Address"}
                                </Label>
                                <div className="relative">
                                    <Mail className={cn("absolute top-3 h-4 w-4 text-gray-400", dir === "rtl" ? "right-3" : "left-3")} />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                        disabled={isLoading}
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className={cn("pl-10", dir === "rtl" && "pr-10 pl-3 text-right")}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className={cn("text-sm font-medium text-gray-700", dir === "rtl" && "text-right block")}>
                                    {dir === "rtl" ? "كلمة المرور" : "Password"}
                                </Label>
                                <div className="relative">
                                    <Lock className={cn("absolute top-3 h-4 w-4 text-gray-400", dir === "rtl" ? "right-3" : "left-3")} />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={dir === "rtl" ? "أدخل كلمة المرور" : "Enter your password"}
                                        required
                                        disabled={isLoading}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange("password", e.target.value)}
                                        className={cn("pl-10 pr-10", dir === "rtl" && "pr-10 pl-3 text-right")}
                                    />
                                    <button
                                        type="button"
                                        className={cn("absolute top-3 h-4 w-4 text-gray-400 hover:text-gray-600", dir === "rtl" ? "left-3" : "right-3")}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className={cn("text-sm font-medium text-gray-700", dir === "rtl" && "text-right block")}>
                                    {dir === "rtl" ? "تأكيد كلمة المرور" : "Confirm Password"}
                                </Label>
                                <div className="relative">
                                    <Lock className={cn("absolute top-3 h-4 w-4 text-gray-400", dir === "rtl" ? "right-3" : "left-3")} />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder={dir === "rtl" ? "أعد إدخال كلمة المرور" : "Confirm your password"}
                                        required
                                        disabled={isLoading}
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                        className={cn("pl-10 pr-10", dir === "rtl" && "pr-10 pl-3 text-right")}
                                    />
                                    <button
                                        type="button"
                                        className={cn("absolute top-3 h-4 w-4 text-gray-400 hover:text-gray-600", dir === "rtl" ? "left-3" : "right-3")}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>


                            {/* Address (Optional) */} 
                            <div className="space-y-2">
                                <Label htmlFor="address" className={cn("text-sm font-medium text-gray-700", dir === "rtl" && "text-right block")}>
                                    {dir === "rtl" ? "العنوان (اختياري)" : "Address (Optional)"}
                                </Label>
                                <div className="relative">
                                    <MapPin className={cn("absolute top-3 h-4 w-4 text-gray-400", dir === "rtl" ? "right-3" : "left-3")} />
                                    <Input
                                        id="address"
                                        name="address"
                                        type="text"
                                        placeholder={dir === "rtl" ? "أدخل عنوانك" : "Enter your address"}
                                        disabled={isLoading}
                                        value={formData.address}
                                        onChange={(e) => handleInputChange("address", e.target.value)}
                                        className={cn("pl-10", dir === "rtl" && "pr-10 pl-3 text-right")}
                                    />
                                </div>
                            </div>

                            {/* Phone Number (Optional) */}
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className={cn("text-sm font-medium text-gray-700", dir === "rtl" && "text-right block")}>
                                    {dir === "rtl" ? "رقم الهاتف (اختياري)" : "Phone Number (Optional)"}
                                </Label>
                                <div className="relative">
                                    <Phone className={cn("absolute top-3 h-4 w-4 text-gray-400", dir === "rtl" ? "right-3" : "left-3")} />
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        placeholder={dir === "rtl" ? "أدخل رقم هاتفك" : "Enter your phone number"}
                                        disabled={isLoading}
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                        className={cn("pl-10", dir === "rtl" && "pr-10 pl-3 text-right")}
                                    />
                                </div>
                            </div>

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

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">
                                        {dir === "rtl" ? "أو" : "Or"}
                                    </span>
                                </div>
                            </div>

                            {/* Google Sign-In Button */}
                            <GoogleSignInButton callbackUrl={`/${lang}`} />
                        </form>

                        {/* Continue Shopping Button */}
                        <div className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push(`/${lang}`)}
                                className={cn("w-full flex items-center justify-center gap-2", dir === "rtl" && "flex-row-reverse")}
                            >
                                <ShoppingBag className="h-4 w-4" />
                                <span>{dir === "rtl" ? "متابعة التسوق بدون حساب" : "Continue Shopping Without Account"}</span>
                            </Button>
                        </div>

                        {/* Login Link */}
                        <div className={cn("mt-6 text-center", dir === "rtl" && "text-right")}>
                            <p className="text-sm text-gray-600">
                                {dir === "rtl" ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
                                <button
                                    type="button"
                                    onClick={() => router.push(`/${lang}/signin`)}
                                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                    {dir === "rtl" ? "تسجيل الدخول" : "Sign In"}
                                </button>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
