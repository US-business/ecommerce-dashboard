"use client"

import type { Locale } from "./i18n-config"
import enTranslations from "./translations/en.json"
import arTranslations from "./translations/ar.json"

const translations = {
  en: enTranslations,
  ar: arTranslations,
}

type TranslationKey = keyof typeof enTranslations
type NestedTranslationKey<T> = T extends object
  ? { [K in keyof T]: T[K] extends object ? `${string & K}.${string & keyof T[K]}` : string & K }[keyof T]
  : never

type AllTranslationKeys = NestedTranslationKey<typeof enTranslations>

export function getTranslation(locale: Locale, key: AllTranslationKeys): string {
  const keys = key.split(".")
  let value: any = translations[locale]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}
