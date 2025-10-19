"use client"

import { Input } from "@/components/shadcnUI/input"
import { Label } from "@/components/shadcnUI/label"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, User, Mail, Lock, MapPin, Phone } from "lucide-react"

interface SignUpFormFieldsProps {
  formData: {
    username: string
    email: string
    password: string
    confirmPassword: string
    address: string
    phoneNumber: string
  }
  showPassword: boolean
  showConfirmPassword: boolean
  isLoading: boolean
  dir: "ltr" | "rtl"
  onInputChange: (field: string, value: string) => void
  onTogglePassword: () => void
  onToggleConfirmPassword: () => void
}

export function SignUpFormFields({
  formData,
  showPassword,
  showConfirmPassword,
  isLoading,
  dir,
  onInputChange,
  onTogglePassword,
  onToggleConfirmPassword
}: SignUpFormFieldsProps) {
  return (
    <>
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
            onChange={(e) => onInputChange("username", e.target.value)}
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
            onChange={(e) => onInputChange("email", e.target.value)}
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
            onChange={(e) => onInputChange("password", e.target.value)}
            className={cn("pl-10 pr-10", dir === "rtl" && "pr-10 pl-10 text-right")}
          />
          <button
            type="button"
            className={cn("absolute top-3 h-4 w-4 text-gray-400 hover:text-gray-600", dir === "rtl" ? "left-3" : "right-3")}
            onClick={onTogglePassword}
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
            onChange={(e) => onInputChange("confirmPassword", e.target.value)}
            className={cn("pl-10 pr-10", dir === "rtl" && "pr-10 pl-10 text-right")}
          />
          <button
            type="button"
            className={cn("absolute top-3 h-4 w-4 text-gray-400 hover:text-gray-600", dir === "rtl" ? "left-3" : "right-3")}
            onClick={onToggleConfirmPassword}
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
            onChange={(e) => onInputChange("address", e.target.value)}
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
            onChange={(e) => onInputChange("phoneNumber", e.target.value)}
            className={cn("pl-10", dir === "rtl" && "pr-10 pl-3 text-right")}
          />
        </div>
      </div>
    </>
  )
}
