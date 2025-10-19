import "server-only"
import { logger } from "@/lib/utils/logger"
import { isDevelopment } from "@/lib/config/runtime-env"
import {
  AppError,
  getErrorMessage,
  getErrorCode,
  getStatusCode,
  isOperationalError,
  ErrorCode,
} from "./app-error"
import { apiError, apiInternalError } from "@/lib/api/response"
import { ZodError } from "zod"

/**
 * Error handler for API routes
 * Converts errors to standardized API responses
 */
export function handleApiError(error: unknown): Response {
  // Log the error
  logger.error("API Error", error)

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const details = error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }))

    return apiError(
      "Validation failed",
      422,
      isDevelopment ? details : undefined
    )
  }

  // Handle custom AppError
  if (error instanceof AppError) {
    return apiError(
      error.message,
      error.statusCode,
      isDevelopment ? error.details : undefined
    )
  }

  // Handle unknown errors
  const message = getErrorMessage(error)
  const statusCode = getStatusCode(error)

  return apiInternalError(
    isDevelopment ? message : "An internal error occurred",
    isDevelopment ? { error } : undefined
  )
}

/**
 * Higher-order function to wrap API route handlers with error handling
 * 
 * @example
 * ```typescript
 * export const POST = withErrorHandler(async (request: Request) => {
 *   // Your API logic here
 *   // Throw AppError or any error, it will be handled automatically
 *   if (!data) {
 *     throw new NotFoundError('Data')
 *   }
 *   return apiSuccess(data)
 * })
 * ```
 */
export function withErrorHandler(
  handler: (request: Request, context?: any) => Promise<Response> | Response
): (request: Request, context?: any) => Promise<Response> {
  return async (request: Request, context?: any) => {
    try {
      return await handler(request, context)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

/**
 * Log error based on severity
 */
export function logError(error: Error): void {
  if (isOperationalError(error)) {
    logger.warn(error.message, error)
  } else {
    logger.error(error.message, error)
  }
}

/**
 * Global error handler for unhandled errors
 * Should be called in a global error boundary or process error handler
 */
export function handleUncaughtError(error: Error): void {
  logError(error)

  // If it's not an operational error, we might want to restart the process
  if (!isOperationalError(error)) {
    // In production, you might want to:
    // 1. Send error to monitoring service (Sentry, etc.)
    // 2. Gracefully shutdown
    // 3. Let process manager restart the app
    logger.error("Non-operational error detected. Application might be in an unstable state.")
    
    if (!isDevelopment) {
      // Graceful shutdown in production
      // process.exit(1)
    }
  }
}

/**
 * Convert database errors to AppError
 */
export function handleDatabaseError(error: unknown): AppError {
  const message = getErrorMessage(error)
  
  // Check for common database errors
  if (message.includes("unique constraint") || message.includes("UNIQUE")) {
    return new AppError(
      "Resource already exists",
      ErrorCode.ALREADY_EXISTS,
      409,
      true,
      isDevelopment ? error : undefined
    )
  }
  
  if (message.includes("foreign key") || message.includes("FOREIGN KEY")) {
    return new AppError(
      "Related resource not found",
      ErrorCode.NOT_FOUND,
      404,
      true,
      isDevelopment ? error : undefined
    )
  }
  
  if (message.includes("connection") || message.includes("timeout")) {
    return new AppError(
      "Database connection failed",
      ErrorCode.CONNECTION_FAILED,
      503,
      true,
      isDevelopment ? error : undefined
    )
  }

  // Generic database error
  return new AppError(
    "Database operation failed",
    ErrorCode.DATABASE_ERROR,
    500,
    true,
    isDevelopment ? error : undefined
  )
}

/**
 * Sanitize error for client
 * Removes sensitive information in production
 */
export function sanitizeError(error: AppError): Partial<AppError> {
  if (isDevelopment) {
    return error
  }

  // In production, only return safe information
  return {
    name: error.name,
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    // Don't expose details, stack trace, or internal info
  }
}
