"use client"

import { useEffect } from 'react'
import { useI18nStore } from '@/lib/stores/i18n-store'
import { type Locale } from '@/lib/i18n/i18n-config'

interface StoreInitializerProps {
  children: React.ReactNode
  locale: Locale
}

export function StoreInitializer({ children, locale }: StoreInitializerProps) {
  const { setLocale } = useI18nStore()


  useEffect(() => {
    // Update the store and the DOM whenever the locale from the URL changes
    setLocale(locale)
    
    const dir = locale === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = locale
    document.documentElement.dir = dir

    if (dir === "rtl") {
      document.documentElement.classList.add("rtl")
    } else {
      document.documentElement.classList.remove("rtl")
    }
  }, [locale, setLocale])

  return <>{children}</>
}
