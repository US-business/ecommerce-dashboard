"use client"

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useI18nStore } from '@/lib/stores/i18n-store'

interface StoreInitializerProps {
  children: React.ReactNode
}

export function StoreInitializer({ children }: StoreInitializerProps) {
  const { loadUser } = useAuthStore()
  const { locale, dir } = useI18nStore()

  useEffect(() => {
    // Load user data on app initialization
    loadUser()
  }, [loadUser])

  useEffect(() => {
    // Apply RTL/LTR direction to document on mount
    if (typeof document !== 'undefined') {
      document.documentElement.dir = dir
      document.documentElement.lang = locale
      document.body.dir = dir

      if (locale === "ar") {
        document.documentElement.classList.add("rtl")
        document.body.classList.add("rtl")
      } else {
        document.documentElement.classList.remove("rtl")
        document.body.classList.remove("rtl")
      }
    }
  }, [locale, dir])

  return <>{children}</>
}
