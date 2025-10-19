"use client"

import { Button } from "@/components/shadcnUI/button"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

interface SignUpActionsProps {
  dir: "ltr" | "rtl"
  lang: string
  onContinueShopping: () => void
  onSignIn: () => void
}

export function SignUpActions({
  dir,
  lang,
  onContinueShopping,
  onSignIn
}: SignUpActionsProps) {
  return (
    <>
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

      {/* Continue Shopping Button */}
      <div className="mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onContinueShopping}
          className={cn("w-full flex items-center justify-center gap-2", dir === "rtl" && "flex-row-reverse")}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>{dir === "rtl" ? "متابعة التسوق بدون حساب" : "Continue Shopping Without Account"}</span>
        </Button>
      </div>

      {/* Login Link */}
      <div className={cn("mt-6  text-center text-blue-800 cursor-pointer  space-x-3 bg-blue-50 border-blue-200 rounded-lg p-2")}>
        <p className="text-sm inline-block">
          {dir === "rtl" ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
        </p>
          <button
            type="button"
            onClick={onSignIn}
            className="font-medium hover:text-primary hover:underline transition-colors"
          >
            {dir === "rtl" ? "تسجيل الدخول" : "Sign In"}
          </button>
      </div>
    </>
  )
}
