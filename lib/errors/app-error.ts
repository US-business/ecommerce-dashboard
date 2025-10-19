/**
 * Custom Application Error Classes
 * Provides typed error handling with proper error codes and messages
 */

/**
 * Error codes for different types of errors
 */
export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  
  // Validation
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",
  
  // Resources
  NOT_FOUND = "NOT_FOUND",
  ALREADY_EXISTS = "ALREADY_EXISTS",
  CONFLICT = "CONFLICT",
  
  // Database
  DATABASE_ERROR = "DATABASE_ERROR",
  QUERY_FAILED = "QUERY_FAILED",
  CONNECTION_FAILED = "CONNECTION_FAILED",
  
  // External Services
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
  CLOUDINARY_ERROR = "CLOUDINARY_ERROR",
  PAYMENT_ERROR = "PAYMENT_ERROR",
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  
  // General
  INTERNAL_ERROR = "INTERNAL_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
  NETWORK_ERROR = "NETWORK_ERROR",
}

/**
 * Base Application Error class
 */
export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly details?: unknown

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.INTERNAL_ERROR,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: unknown
  ) {
    super(message)
    
    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.details = details

    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor)
  }

  /**
   * Convert error to JSON for API responses
   */
  toJSON() {
    const json: Record<string, unknown> = {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
    }
    
    if (this.details) {
      json.details = this.details
    }
    
    return json
  }
}

/**
 * Authentication Error
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed", details?: unknown) {
    super(message, ErrorCode.UNAUTHORIZED, 401, true, details)
  }
}

/**
 * Authorization Error
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied", details?: unknown) {
    super(message, ErrorCode.FORBIDDEN, 403, true, details)
  }
}

/**
 * Validation Error
 */
export class ValidationError extends AppError {
  constructor(message: string = "Validation failed", details?: unknown) {
    super(message, ErrorCode.VALIDATION_ERROR, 422, true, details)
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends AppError {
  constructor(resource: string = "Resource", details?: unknown) {
    super(`${resource} not found`, ErrorCode.NOT_FOUND, 404, true, details)
  }
}

/**
 * Conflict Error
 */
export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict", details?: unknown) {
    super(message, ErrorCode.CONFLICT, 409, true, details)
  }
}

/**
 * Database Error
 */
export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed", details?: unknown) {
    super(message, ErrorCode.DATABASE_ERROR, 500, true, details)
  }
}

/**
 * External Service Error
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, message: string = "Service unavailable", details?: unknown) {
    super(
      `${service}: ${message}`,
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      503,
      true,
      details
    )
  }
}

/**
 * Rate Limit Error
 */
export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests", details?: unknown) {
    super(message, ErrorCode.RATE_LIMIT_EXCEEDED, 429, true, details)
  }
}

/**
 * Bad Request Error
 */
export class BadRequestError extends AppError {
  constructor(message: string = "Bad request", details?: unknown) {
    super(message, ErrorCode.BAD_REQUEST, 400, true, details)
  }
}

/**
 * Check if error is an operational error (vs programming error)
 */
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational
  }
  return false
}

/**
 * Extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "An unknown error occurred"
}

/**
 * Extract error code from unknown error
 */
export function getErrorCode(error: unknown): ErrorCode {
  if (error instanceof AppError) {
    return error.code
  }
  return ErrorCode.INTERNAL_ERROR
}

/**
 * Extract status code from unknown error
 */
export function getStatusCode(error: unknown): number {
  if (error instanceof AppError) {
    return error.statusCode
  }
  return 500
}
