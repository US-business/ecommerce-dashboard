"use client"

import { useState } from "react"
import { useI18nStore } from "@/lib/stores/i18n-store"
import {
  SuccessMessage,
  ChangePasswordFormContent,
  validatePasswordForm,
  changePassword,
  type ChangePasswordFormProps,
  type PasswordFormData
} from "./_components"

export function ChangePasswordForm({ onSuccess, onCancel }: ChangePasswordFormProps) {
  const { dir } = useI18nStore()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "", 
    confirmPassword: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("")
    if (success) setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    const validation = validatePasswordForm(formData, dir)
    if (!validation.isValid) {
      setError(validation.error)
      setIsLoading(false)
      return
    }

    const result = await changePassword(formData.currentPassword, formData.newPassword)
    
    if (!result.success) {
      setError(result.error || (dir === "rtl" ? "فشل في تغيير كلمة المرور" : "Failed to change password"))
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
    
    if (onSuccess) {
      setTimeout(() => {
        onSuccess()
      }, 2000)
    }
    
    setIsLoading(false)
  }

  if (success) {
    return <SuccessMessage dir={dir} onCancel={onCancel} />
  }

  return (
    <ChangePasswordFormContent
      dir={dir}
      formData={formData}
      isLoading={isLoading}
      error={error}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  )
}