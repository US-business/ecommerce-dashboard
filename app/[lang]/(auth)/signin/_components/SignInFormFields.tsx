"use client"

import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { cn } from "@/lib/utils"

interface SignInFormFieldsProps {
  email: string
  password: string
  isLoading: boolean
  fieldErrors: { email?: string; password?: string }
  dir: "ltr" | "rtl"
  t: (key: string) => string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
}

export function SignInFormFields({
  email,
  password,
  isLoading,
  fieldErrors,
  dir,
  t,
  onEmailChange,
  onPasswordChange
}: SignInFormFieldsProps) {
  return (
    <>
      {/* Email Field */}
      <div className="space-y-2">
        <Label 
          htmlFor="email" 
          className={cn("text-sm font-medium", dir === "rtl" && "text-right block")}
        >
          {t("auth.email")}
        </Label>
        <Input 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e) => onEmailChange(e.target.value)}
          required 
          disabled={isLoading}
          className={cn(fieldErrors.email && "border-red-500")}
        />
        {fieldErrors.email && (
          <p className={cn("text-xs text-red-500", dir === "rtl" && "text-right")}>
            {fieldErrors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label 
          htmlFor="password" 
          className={cn("text-sm font-medium", dir === "rtl" && "text-right block")}
        >
          {t("auth.password")}
        </Label>
        <Input 
          id="password" 
          type="password" 
          value={password} 
          onChange={(e) => onPasswordChange(e.target.value)}
          required 
          disabled={isLoading}
          className={cn(fieldErrors.password && "border-red-500")}
        />
        {fieldErrors.password && (
          <p className={cn("text-xs text-red-500", dir === "rtl" && "text-right")}>
            {fieldErrors.password}
          </p>
        )}
      </div>
    </>
  )
}
