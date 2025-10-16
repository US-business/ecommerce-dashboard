import 'server-only'
import type { Locale } from './i18n-config'
import type { Dictionary } from './dictionary-types'
import { locales, defaultLocale } from './i18n-config'

// We enumerate all dictionaries here for better linting and typescript support
const dictionaries = {
  en: () => import('./translations/en.json').then((module) => module.default),
  ar: () => import('./translations/ar.json').then((module) => module.default),
} as const

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  // Validate locale and fallback to default if invalid
  const validLocale = locales.includes(locale) ? locale : defaultLocale

  // Ensure the dictionary function exists
  if (!dictionaries[validLocale]) {
    console.error(`Dictionary for locale ${validLocale} not found, falling back to ${defaultLocale}`)
    return await dictionaries[defaultLocale]()
  }

  return await dictionaries[validLocale]()
}
