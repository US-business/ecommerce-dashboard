import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { Locale } from "@/lib/i18n/i18n-config"
import { defaultLocale } from "@/lib/i18n/i18n-config"
import { getTranslation } from "@/lib/i18n/use-i18n"

interface I18nState {
  locale: Locale
  dir: "ltr" | "rtl"
  lang: string
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

export const useI18nStore = create<I18nState>()(
  subscribeWithSelector((set, get) => ({
    locale: defaultLocale,
    dir: defaultLocale === "ar" ? "rtl" : "ltr",
    lang: defaultLocale,

    setLocale: (locale: Locale) => {
      const dir = locale === "ar" ? "rtl" : "ltr"
      set({ locale, dir, lang: locale })
    },

    t: (key: string) => {
      const { locale } = get()
      return getTranslation(locale, key as any)
    }
  }))
)
