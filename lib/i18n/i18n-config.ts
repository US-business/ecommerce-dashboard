export const defaultLocale: Locale = "ar"
export const locales = ["en", "ar"] as const
export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
}

export const i18n = {
  defaultLocale,
  locales,
  localeNames,
} as const

const STORAGE_KEY = 'preferred-locale'
const COOKIE_KEY = 'preferred-locale'

// Helper functions for cookies
function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
  return match ? decodeURIComponent(match[1]) : null
}

export const i18nConfig = {
  /**
   * Save locale to localStorage
   */
  saveLocale: (locale: Locale): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, locale)
    }
    setCookie(COOKIE_KEY, locale)
  },

  /**
   * Get locale from localStorage
   */
  getSavedLocale: (): Locale | null => {
    if (typeof window === 'undefined') return null
    // Try localStorage first
    let saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && locales.includes(saved)) return saved
    // Fallback to cookie
    const cookieLocale = getCookie(COOKIE_KEY) as Locale | null
    if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale
    return null
  },

  /**
   * Get the active locale (from storage or default)
   */
  getActiveLocale: (): Locale => {
    let locale = i18nConfig.getSavedLocale()
    if (!locale) {
      // Save default to both localStorage and cookie if not set
      i18nConfig.saveLocale(defaultLocale)
      locale = defaultLocale
    }
    return locale
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
