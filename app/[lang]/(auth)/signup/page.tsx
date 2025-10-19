"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAuth } from "@/lib/stores"
import { LanguageToggle } from "@/components/language-toggle"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { SignUpSkeleton, SignUpHeader, SignUpForm } from "./_components"

export default function SignUpPage() {
    const { dir } = useI18nStore()
    const params = useParams()
    const lang = (params?.lang as string) || (dir === "rtl" ? "ar" : "en")
    const { user, isLoading: authLoading } = useAuth()
    const { status } = useSession()
    const router = useRouter()

    // Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user && status === "authenticated") {
            router.replace(`/${lang}`)
        }
    }, [user, authLoading, status, router, lang])

    // Show skeleton while checking auth status
    if (authLoading || status === "loading") {
        return <SignUpSkeleton dir={dir} />
    }

    // If user is already logged in, show skeleton with redirect
    if (user) {
        return <SignUpSkeleton dir={dir} />
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            {/* Language Toggle */}
            <div className={cn("absolute top-4", dir === "rtl" ? "left-4" : "right-4")}>
                <LanguageToggle />
            </div>

            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <SignUpHeader dir={dir} />

                {/* Form */}
                <SignUpForm dir={dir} lang={lang} />
            </div>
        </div>
    )
}
