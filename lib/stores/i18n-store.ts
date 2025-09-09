import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { Locale } from "@/lib/i18n/config"
import { i18nConfig } from "@/lib/i18n/config"
import { getTranslation } from "@/lib/i18n/use-i18n"

interface I18nState {
  locale: Locale
  dir: "ltr" | "rtl"
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const getInitialState = (): { locale: Locale; dir: "ltr" | "rtl" } => {
  if (typeof window !== 'undefined') {
    const savedLocale = localStorage.getItem('preferred-locale') as Locale
    if (savedLocale && (savedLocale === 'ar' || savedLocale === 'en')) {
      return {
        locale: savedLocale,
        dir: savedLocale === 'ar' ? 'rtl' : 'ltr'
      }
    }
  }
  return {
    locale: 'ar',
    dir: 'rtl'
  }
}

export const useI18nStore = create<I18nState>()(
  subscribeWithSelector((set, get) => ({
    ...getInitialState(),

    setLocale: (locale: Locale) => {
      const dir = locale === "ar" ? "rtl" : "ltr"
      
      // Save to localStorage first
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferred-locale', locale)
      }
      
      // Then apply locale settings
      i18nConfig.applyLocale(locale)
      
      set({ locale, dir })
    },

    t: (key: string) => {
      const { locale } = get()
      return getTranslation(locale, key as any)
    }
  }))
)
