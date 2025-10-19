"use client"

import { LogIn } from "lucide-react"

interface SignInHeaderProps {
  dir: "ltr" | "rtl"
}

export function SignInHeader({ dir }: SignInHeaderProps) {
  return (
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
  )
}
