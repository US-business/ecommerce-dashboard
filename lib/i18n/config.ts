export const defaultLocale: Locale = "ar"
export const locales = ["en", "ar"] as const
export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
}

const STORAGE_KEY = 'preferred-locale'

export const i18nConfig = {
  /**
   * Save locale to localStorage
   */
  saveLocale: (locale: Locale): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, locale)
    }
  },

  /**
   * Get locale from localStorage
   */
  getSavedLocale: (): Locale | null => {
    if (typeof window === 'undefined') return null
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    return saved && locales.includes(saved) ? saved : null
  },

  /**
   * Get the active locale (from storage or default)
   */
  getActiveLocale: (): Locale => {
    return i18nConfig.getSavedLocale() || defaultLocale
  },

  /**
   * Apply locale settings to document
   */
  applyLocale: (locale: Locale): void => {
    if (typeof document === 'undefined') return
    
    const dir = locale === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = locale
    document.documentElement.dir = dir
    document.body.dir = dir

    if (locale === "ar") {
      document.documentElement.classList.add("rtl")
      document.body.classList.add("rtl")
    } else {
      document.documentElement.classList.remove("rtl")
      document.body.classList.remove("rtl")
    }
  }
}
