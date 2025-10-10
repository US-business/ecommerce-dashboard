"use client"

import { useTranslation } from './use-translation'

export type ValidationRule = {
   type: 'required' | 'email' | 'minLength' | 'maxLength' | 'minValue' | 'maxValue' | 'phone' | 'url' | 'custom'
   value?: number | string
   message?: string
   validator?: (value: any) => boolean
}

export type ValidationErrors = Record<string, string>

/**
 * Hook for form validation with automatic translation
 */
export function useValidation() {
   const { getValidationError, tWithInterpolation } = useTranslation()

   /**
    * Validate a single field
    */
   const validateField = (value: any, rules: ValidationRule[]): string | null => {
      for (const rule of rules) {
         let isValid = true
         let errorMessage = ''

         switch (rule.type) {
            case 'required':
               isValid = value !== null && value !== undefined && value !== ''
               errorMessage = rule.message || getValidationError('required')
               break

            case 'email':
               const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
               isValid = !value || emailRegex.test(value)
               errorMessage = rule.message || getValidationError('invalidEmail')
               break

            case 'minLength':
               isValid = !value || value.length >= (rule.value as number)
               errorMessage = rule.message || getValidationError('minLength', { min: rule.value })
               break

            case 'maxLength':
               isValid = !value || value.length <= (rule.value as number)
               errorMessage = rule.message || getValidationError('maxLength', { max: rule.value })
               break

            case 'minValue':
               const numValue = parseFloat(value)
               isValid = !value || (!isNaN(numValue) && numValue >= (rule.value as number))
               errorMessage = rule.message || getValidationError('minValue', { min: rule.value })
               break

            case 'maxValue':
               const maxNumValue = parseFloat(value)
               isValid = !value || (!isNaN(maxNumValue) && maxNumValue <= (rule.value as number))
               errorMessage = rule.message || getValidationError('maxValue', { max: rule.value })
               break

            case 'phone':
               const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
               isValid = !value || phoneRegex.test(value.replace(/\s/g, ''))
               errorMessage = rule.message || getValidationError('invalidPhoneNumber')
               break

            case 'url':
               try {
                  if (value) new URL(value)
                  isValid = true
               } catch {
                  isValid = false
               }
               errorMessage = rule.message || getValidationError('invalidUrl')
               break

            case 'custom':
               if (rule.validator) {
                  isValid = rule.validator(value)
                  errorMessage = rule.message || getValidationError('required')
               }
               break
         }

         if (!isValid) {
            return errorMessage
         }
      }

      return null
   }

   /**
    * Validate multiple fields
    */
   const validateFields = (
      data: Record<string, any>,
      rules: Record<string, ValidationRule[]>
   ): ValidationErrors => {
      const errors: ValidationErrors = {}

      Object.entries(rules).forEach(([fieldName, fieldRules]) => {
         const value = data[fieldName]
         const error = validateField(value, fieldRules)
         if (error) {
            errors[fieldName] = error
         }
      })

      return errors
   }

   /**
    * Common validation rules
    */
   const commonRules = {
      required: (): ValidationRule => ({ type: 'required' }),
      email: (): ValidationRule => ({ type: 'email' }),
      minLength: (length: number): ValidationRule => ({ type: 'minLength', value: length }),
      maxLength: (length: number): ValidationRule => ({ type: 'maxLength', value: length }),
      minValue: (value: number): ValidationRule => ({ type: 'minValue', value }),
      maxValue: (value: number): ValidationRule => ({ type: 'maxValue', value }),
      phone: (): ValidationRule => ({ type: 'phone' }),
      url: (): ValidationRule => ({ type: 'url' }),
      custom: (validator: (value: any) => boolean, message?: string): ValidationRule => ({
         type: 'custom',
         validator,
         message
      }),

      // Specific rules combinations
      requiredEmail: (): ValidationRule[] => [commonRules.required(), commonRules.email()],
      requiredMinLength: (length: number): ValidationRule[] => [commonRules.required(), commonRules.minLength(length)],
      password: (): ValidationRule[] => [commonRules.required(), commonRules.minLength(6)],
      requiredPhone: (): ValidationRule[] => [commonRules.required(), commonRules.phone()],
   }

   /**
    * Password confirmation validation
    */
   const validatePasswordConfirmation = (password: string, confirmPassword: string): string | null => {
      if (password !== confirmPassword) {
         return getValidationError('passwordsNotMatch')
      }
      return null
   }

   return {
      validateField,
      validateFields,
      validatePasswordConfirmation,
      rules: commonRules,
   }
}