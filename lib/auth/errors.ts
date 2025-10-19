/**
 * Authentication Error Types and Handlers
 * Unified error handling system for authentication
 */

// Error codes for authentication
export enum AuthErrorCode {
  // Authentication errors
  UNAUTHORIZED = "UNAUTHORIZED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  NO_SESSION = "NO_SESSION",
  
  // Authorization errors
  FORBIDDEN = "FORBIDDEN",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
  
  // User errors
  USER_NOT_FOUND = "USER_NOT_FOUND",
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  INVALID_EMAIL = "INVALID_EMAIL",
  INVALID_PASSWORD = "INVALID_PASSWORD",
  
  // Database errors
  DATABASE_ERROR = "DATABASE_ERROR",
  DATABASE_CONNECTION_FAILED = "DATABASE_CONNECTION_FAILED",
  
  // Validation errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  MISSING_FIELDS = "MISSING_FIELDS",
  
  // Server errors
  INTERNAL_ERROR = "INTERNAL_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

// Error messages in both languages
export const AuthErrorMessages = {
  [AuthErrorCode.UNAUTHORIZED]: {
    en: "You are not authorized to perform this action",
    ar: "غير مصرح لك بتنفيذ هذا الإجراء"
  },
  [AuthErrorCode.INVALID_CREDENTIALS]: {
    en: "Invalid email or password",
    ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
  },
  [AuthErrorCode.SESSION_EXPIRED]: {
    en: "Your session has expired. Please sign in again",
    ar: "انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى"
  },
  [AuthErrorCode.NO_SESSION]: {
    en: "No active session found",
    ar: "لا توجد جلسة نشطة"
  },
  [AuthErrorCode.FORBIDDEN]: {
    en: "Access denied",
    ar: "تم رفض الوصول"
  },
  [AuthErrorCode.INSUFFICIENT_PERMISSIONS]: {
    en: "You don't have permission to access this resource",
    ar: "ليس لديك صلاحية للوصول إلى هذا المورد"
  },
  [AuthErrorCode.USER_NOT_FOUND]: {
    en: "User not found",
    ar: "المستخدم غير موجود"
  },
  [AuthErrorCode.USER_ALREADY_EXISTS]: {
    en: "User already exists",
    ar: "المستخدم موجود بالفعل"
  },
  [AuthErrorCode.INVALID_EMAIL]: {
    en: "Invalid email address",
    ar: "عنوان البريد الإلكتروني غير صالح"
  },
  [AuthErrorCode.INVALID_PASSWORD]: {
    en: "Password must be at least 6 characters",
    ar: "يجب أن تكون كلمة المرور 6 أحرف على الأقل"
  },
  [AuthErrorCode.DATABASE_ERROR]: {
    en: "Database error occurred",
    ar: "حدث خطأ في قاعدة البيانات"
  },
  [AuthErrorCode.DATABASE_CONNECTION_FAILED]: {
    en: "Failed to connect to database",
    ar: "فشل الاتصال بقاعدة البيانات"
  },
  [AuthErrorCode.VALIDATION_ERROR]: {
    en: "Validation error",
    ar: "خطأ في التحقق من الصحة"
  },
  [AuthErrorCode.MISSING_FIELDS]: {
    en: "Required fields are missing",
    ar: "الحقول المطلوبة مفقودة"
  },
  [AuthErrorCode.INTERNAL_ERROR]: {
    en: "Internal server error",
    ar: "خطأ داخلي في الخادم"
  },
  [AuthErrorCode.UNKNOWN_ERROR]: {
    en: "An unknown error occurred",
    ar: "حدث خطأ غير معروف"
  },
}

// Custom Auth Error class
export class AuthError extends Error {
  code: AuthErrorCode
  statusCode: number
  details?: any

  constructor(
    code: AuthErrorCode,
    message?: string,
    statusCode: number = 500,
    details?: any
  ) {
    super(message || AuthErrorMessages[code].en)
    this.name = "AuthError"
    this.code = code
    this.statusCode = statusCode
    this.details = details
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      details: this.details
    }
  }

  getLocalizedMessage(lang: "en" | "ar" = "en"): string {
    return AuthErrorMessages[this.code][lang]
  }
}

// Error factory functions
export const createAuthError = {
  unauthorized: (details?: any) => 
    new AuthError(AuthErrorCode.UNAUTHORIZED, undefined, 401, details),
  
  invalidCredentials: (details?: any) => 
    new AuthError(AuthErrorCode.INVALID_CREDENTIALS, undefined, 401, details),
  
  sessionExpired: (details?: any) => 
    new AuthError(AuthErrorCode.SESSION_EXPIRED, undefined, 401, details),
  
  noSession: (details?: any) => 
    new AuthError(AuthErrorCode.NO_SESSION, undefined, 401, details),
  
  forbidden: (details?: any) => 
    new AuthError(AuthErrorCode.FORBIDDEN, undefined, 403, details),
  
  insufficientPermissions: (details?: any) => 
    new AuthError(AuthErrorCode.INSUFFICIENT_PERMISSIONS, undefined, 403, details),
  
  userNotFound: (details?: any) => 
    new AuthError(AuthErrorCode.USER_NOT_FOUND, undefined, 404, details),
  
  userAlreadyExists: (details?: any) => 
    new AuthError(AuthErrorCode.USER_ALREADY_EXISTS, undefined, 409, details),
  
  invalidEmail: (details?: any) => 
    new AuthError(AuthErrorCode.INVALID_EMAIL, undefined, 400, details),
  
  invalidPassword: (details?: any) => 
    new AuthError(AuthErrorCode.INVALID_PASSWORD, undefined, 400, details),
  
  databaseError: (details?: any) => 
    new AuthError(AuthErrorCode.DATABASE_ERROR, undefined, 500, details),
  
  databaseConnectionFailed: (details?: any) => 
    new AuthError(AuthErrorCode.DATABASE_CONNECTION_FAILED, undefined, 503, details),
  
  validationError: (message?: string, details?: any) => 
    new AuthError(AuthErrorCode.VALIDATION_ERROR, message, 400, details),
  
  missingFields: (fields?: string[], details?: any) => 
    new AuthError(
      AuthErrorCode.MISSING_FIELDS,
      fields ? `Missing fields: ${fields.join(", ")}` : undefined,
      400,
      details
    ),
  
  internalError: (details?: any) => 
    new AuthError(AuthErrorCode.INTERNAL_ERROR, undefined, 500, details),
  
  unknownError: (details?: any) => 
    new AuthError(AuthErrorCode.UNKNOWN_ERROR, undefined, 500, details),
}

// Error logger with consistent format
export const logAuthError = (
  context: string,
  error: Error | AuthError | unknown,
  additionalInfo?: Record<string, any>
) => {
  const timestamp = new Date().toISOString()
  const errorInfo = {
    timestamp,
    context,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof AuthError && {
        code: error.code,
        statusCode: error.statusCode,
        details: error.details
      })
    } : {
      message: String(error)
    },
    ...additionalInfo
  }

  console.error(`[AUTH ERROR] ${context}:`, JSON.stringify(errorInfo, null, 2))
  
  return errorInfo
}

// Handle errors in server actions
export const handleServerActionError = (
  context: string,
  error: unknown
): { success: false; error: string; code?: AuthErrorCode } => {
  if (error instanceof AuthError) {
    logAuthError(context, error)
    return {
      success: false,
      error: error.message,
      code: error.code
    }
  }

  if (error instanceof Error) {
    logAuthError(context, error)
    return {
      success: false,
      error: "An error occurred. Please try again."
    }
  }

  logAuthError(context, error)
  return {
    success: false,
    error: "An unknown error occurred"
  }
}

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6
}

// Validate required fields
export const validateRequiredFields = (
  data: Record<string, any>,
  requiredFields: string[]
): void => {
  const missingFields = requiredFields.filter(field => !data[field])
  
  if (missingFields.length > 0) {
    throw createAuthError.missingFields(missingFields)
  }
}
