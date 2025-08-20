import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { Locale } from "@/lib/i18n/config"
import { defaultLocale } from "@/lib/i18n/config"
import { getTranslation } from "@/lib/i18n/use-i18n"

interface I18nState {
  locale: Locale
  dir: "ltr" | "rtl"
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

export const useI18nStore = create<I18nState>()(
  subscribeWithSelector((set, get) => ({
    locale: defaultLocale,
    dir: defaultLocale === "ar" ? "rtl" : "ltr",

    setLocale: (locale: Locale) => {
      const dir = locale === "ar" ? "rtl" : "ltr"
      
      // Apply RTL/LTR direction to document
      if (typeof document !== 'undefined') {
        document.documentElement.dir = dir
        document.documentElement.lang = locale
        document.body.dir = dir

        // Add/remove RTL class for additional styling
        if (locale === "ar") {
          document.documentElement.classList.add("rtl")
          document.body.classList.add("rtl")
        } else {
          document.documentElement.classList.remove("rtl")
          document.body.classList.remove("rtl")
        }
      }

      set({ locale, dir })
    },

    t: (key: string) => {
      const { locale } = get()
      return getTranslation(locale, key as any)
    }
  }))
)
