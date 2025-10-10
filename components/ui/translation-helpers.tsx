"use client"

import React from 'react'
import { useTranslation } from '@/hooks/use-translation'
import { Alert, AlertDescription } from '@/components/shadcnUI/alert'
import { Button } from '@/components/shadcnUI/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcnUI/dialog'

/**
 * Error message component with automatic translation
 */
interface ErrorMessageProps {
  errorType: string
  variables?: Record<string, string | number>
  className?: string
}

export function ErrorMessage({ errorType, variables, className }: ErrorMessageProps) {
  const { getErrorMessage } = useTranslation()
  
  return (
    <Alert variant="destructive" className={className}>
      <AlertDescription>{getErrorMessage(errorType, variables)}</AlertDescription>
    </Alert>
  )
}

/**
 * Success message component with automatic translation
 */
interface SuccessMessageProps {
  messageKey: string
  className?: string
}

export function SuccessMessage({ messageKey, className }: SuccessMessageProps) {
  const { getNotification } = useTranslation()
  
  return (
    <Alert className={className}>
      <AlertDescription>{getNotification('success', messageKey)}</AlertDescription>
    </Alert>
  )
}

/**
 * Validation error component for forms
 */
interface ValidationErrorProps {
  validationType: string
  variables?: Record<string, string | number>
  className?: string
}

export function ValidationError({ validationType, variables, className }: ValidationErrorProps) {
  const { getValidationError } = useTranslation()
  
  return (
    <span className={`text-red-500 text-sm ${className || ''}`}>
      {getValidationError(validationType, variables)}
    </span>
  )
}

/**
 * Confirmation dialog with automatic translation
 */
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  confirmationType: string
  title?: string
  destructive?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  confirmationType,
  title,
  destructive = false
}: ConfirmDialogProps) {
  const { getDialog } = useTranslation()
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title || getDialog('titles', 'confirmation')}
          </DialogTitle>
          <DialogDescription>
            {getDialog('confirm', confirmationType)}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {getDialog('buttons', 'cancel')}
          </Button>
          <Button 
            variant={destructive ? "destructive" : "default"} 
            onClick={onConfirm}
          >
            {getDialog('buttons', destructive ? 'delete' : 'confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Localized content component for multilingual objects
 */
interface LocalizedContentProps {
  content: { en: string; ar: string } | string
  fallbackLocale?: 'en' | 'ar'
  className?: string
  as?: React.ElementType
}

export function LocalizedContent({ 
  content, 
  fallbackLocale = 'en', 
  className, 
  as: Component = 'span' 
}: LocalizedContentProps) {
  const { getLocalizedContent } = useTranslation()
  
  return (
    <Component className={className}>
      {getLocalizedContent(content, fallbackLocale)}
    </Component>
  )
}

/**
 * Currency formatter component
 */
interface CurrencyProps {
  amount: number
  currency?: string
  className?: string
}

export function Currency({ amount, currency = 'USD', className }: CurrencyProps) {
  const { formatCurrency } = useTranslation()
  
  return (
    <span className={className}>
      {formatCurrency(amount, currency)}
    </span>
  )
}

/**
 * Date formatter component
 */
interface DateFormatProps {
  date: Date
  options?: Intl.DateTimeFormatOptions
  className?: string
}

export function DateFormat({ date, options, className }: DateFormatProps) {
  const { formatDate } = useTranslation() 
  
  return (
    <span className={className}>
      {formatDate(date, options)}
    </span>
  )
}

/**
 * Loading message component
 */
interface LoadingMessageProps {
  messageKey?: string
  className?: string
}

export function LoadingMessage({ messageKey = 'loading', className }: LoadingMessageProps) {
  const { getNotification } = useTranslation()
  
  return (
    <div className={`flex items-center justify-center p-4 ${className || ''}`}>
      <span>{getNotification('info', messageKey)}</span>
    </div>
  )
}