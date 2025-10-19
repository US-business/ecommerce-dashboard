/**
 * Error Handling Utilities
 * Centralized exports for error classes and handlers
 */

// Error Classes
export {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  ExternalServiceError,
  RateLimitError,
  BadRequestError,
  ErrorCode,
  isOperationalError,
  getErrorMessage,
  getErrorCode,
  getStatusCode,
} from "./app-error"

// Error Handlers
export {
  handleApiError,
  withErrorHandler,
  logError,
  handleUncaughtError,
  handleDatabaseError,
  sanitizeError,
} from "./error-handler"
