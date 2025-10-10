"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"
import type { Locale } from "@/lib/i18n/i18n-config"

/**
 * Enhanced translation hook that provides better TypeScript support
 * and consistent translation functionality across the app
 */
export function useTranslation() {
  const { locale, dir, t } = useI18nStore()
  
  /**
   * Get localized content from multilingual object
   * @param content Object with 'en' and 'ar' properties
   * @param fallbackLocale Fallback locale if current locale content is missing
   */
  const getLocalizedContent = (
    content: { en: string; ar: string } | string,
    fallbackLocale: Locale = 'en'
  ): string => {
    if (typeof content === 'string') return content
    
    if (content[locale]) return content[locale]
    if (content[fallbackLocale]) return content[fallbackLocale]
    
    // Fallback to any available content
    return content.en || content.ar || ''
  }
  
  /**
   * Get localized field from database objects
   * @param obj Object containing nameEn, nameAr, etc.
   * @param field Field name without language suffix (e.g., 'name', 'description')
   */
  const getLocalizedField = (
    obj: Record<string, any>,
    field: string,
    fallbackLocale: Locale = 'en'
  ): string => {
    const currentField = `${field}${locale === 'ar' ? 'Ar' : 'En'}`
    const fallbackField = `${field}${fallbackLocale === 'ar' ? 'Ar' : 'En'}`
    
    return obj[currentField] || obj[fallbackField] || obj[field] || ''
  }
  
  /**
   * Format number according to current locale
   */
  const formatNumber = (
    number: number,
    options: Intl.NumberFormatOptions = {}
  ): string => {
    const localeCode = locale === 'ar' ? 'ar-SA' : 'en-US'
    return new Intl.NumberFormat(localeCode, options).format(number)
  }
  
  /**
   * Format currency according to current locale
   */
  const formatCurrency = (
    amount: number,
    currency: string = 'USD'
  ): string => {
    return formatNumber(amount, {
      style: 'currency',
      currency,
    })
  }
  
  /**
   * Format date according to current locale
   */
  const formatDate = (
    date: Date,
    options: Intl.DateTimeFormatOptions = {}
  ): string => {
    const localeCode = locale === 'ar' ? 'ar-SA' : 'en-US'
    return new Intl.DateTimeFormat(localeCode, options).format(date)
  }
  
  /**
   * Enhanced translation function with interpolation support
   */
  const tWithInterpolation = (
    key: string,
    variables?: Record<string, string | number>
  ): string => {
    let translation = t(key)
    
    if (variables && typeof translation === 'string') {
      Object.entries(variables).forEach(([variable, value]) => {
        translation = translation.replace(new RegExp(`{${variable}}`, 'g'), String(value))
      })
    }
    
    return translation
  }

  /**
   * Get error message translation
   */
  const getErrorMessage = (
    errorType: string,
    variables?: Record<string, string | number>
  ): string => {
    const key = `errors.${errorType}`
    return tWithInterpolation(key, variables)
  }

  /**
   * Get validation error message
   */
  const getValidationError = (
    validationType: string,
    variables?: Record<string, string | number>
  ): string => {
    const key = `errors.validation.${validationType}`
    return tWithInterpolation(key, variables)
  }

  /**
   * Get notification message
   */
  const getNotification = (
    type: 'success' | 'info' | 'warning',
    messageKey: string
  ): string => {
    const key = `notifications.${type}.${messageKey}`
    return t(key)
  }

  /**
   * Get dialog content
   */
  const getDialog = (
    type: 'confirm' | 'titles' | 'buttons',
    messageKey: string
  ): string => {
    const key = `dialogs.${type}.${messageKey}`
    return t(key)
  }

  return {
    locale,
    dir,
    t,
    tWithInterpolation,
    getLocalizedContent,
    getLocalizedField,
    formatNumber,
    formatCurrency,
    formatDate,
    getErrorMessage,
    getValidationError,
    getNotification,
    getDialog,
    isRTL: dir === 'rtl',
    isArabic: locale === 'ar',
    isEnglish: locale === 'en',
  }
}