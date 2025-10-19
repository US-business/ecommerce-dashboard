"use client"

import { Button } from "@/components/shadcnUI/button"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

interface SignInActionsProps {
  isLoading: boolean
  dir: "ltr" | "rtl"
  lang: string
  onContinueShopping: () => void
  onSignUp: () => void
}

export function SignInActions({
  isLoading,
  dir,
  lang,
  onContinueShopping,
  onSignUp
}: SignInActionsProps) {
  return (
    <>
      {/* Google Sign In */}
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
          onClick={onContinueShopping}
          className={cn("w-full flex items-center justify-center gap-2", dir === "rtl" && "flex-row-reverse")}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>
            {dir === "rtl" ? "متابعة التسوق بدون تسجيل دخول" : "Continue Shopping Without Login"}
          </span>
        </Button>
      </div>

      {/* Sign Up Link */}
      <div className={cn("mt-6  text-center text-blue-800 cursor-pointer  space-x-3 bg-blue-50 border-blue-200 rounded-lg p-2")}>
        <p className="text-sm inline-block text-blue-800">
          {dir === "rtl" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
        </p>
          <button
            type="button"
            onClick={onSignUp}
            className="hover:text-primary hover:underline transition-colors cursor-pointer "
          >
            {dir === "rtl" ? "إنشاء حساب جديد" : "Sign Up"}
          </button>
      </div>
    </>
  )
}
