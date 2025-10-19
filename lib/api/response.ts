import "server-only"
import { ERROR_MESSAGES } from "@/lib/config/constants"
import type { RateLimitResult } from "./rate-limit"

/**
 * API Response Helpers
 * Standardized responses for API routes
 */

/**
 * Success response structure
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
  message?: string
}

/**
 * Error response structure
 */
export interface ApiErrorResponse {
  success: false
  error: string
  details?: unknown
}

/**
 * API Response type
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * Create a successful API response
 * 
 * @example
 * ```typescript
 * return apiSuccess({ user: { id: 1, name: 'John' } })
 * // Returns: Response with status 200 and JSON body
 * ```
 */
export function apiSuccess<T>(
  data: T,
  message?: string,
  status: number = 200
): Response {
  return Response.json(
    {
      success: true,
      data,
      message,
    } as ApiSuccessResponse<T>,
    { status }
  )
}

/**
 * Create an error API response
 * 
 * @example
 * ```typescript
 * return apiError('User not found', 404)
 * ```
 */
export function apiError(
  error: string,
  status: number = 400,
  details?: unknown
): Response {
  return Response.json(
    {
      success: false,
      error,
      details,
    } as ApiErrorResponse,
    { status }
  )
}

/**
 * Create a rate limit exceeded response
 * 
 * @example
 * ```typescript
 * const rateLimitResult = await checkRateLimit(ip, options)
 * if (!rateLimitResult.success) {
 *   return apiRateLimitError(rateLimitResult)
 * }
 * ```
 */
export function apiRateLimitError(result: RateLimitResult): Response {
  return Response.json(
    {
      success: false,
      error: "Too many requests. Please try again later.",
    } as ApiErrorResponse,
    {
      status: 429,
      headers: {
        "Retry-After": String(result.reset),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(result.reset),
      },
    }
  )
}

/**
 * Create an unauthorized response
 */
export function apiUnauthorized(message?: string): Response {
  return apiError(
    message || ERROR_MESSAGES.UNAUTHORIZED,
    401
  )
}

/**
 * Create a forbidden response
 */
export function apiForbidden(message?: string): Response {
  return apiError(
    message || ERROR_MESSAGES.FORBIDDEN,
    403
  )
}

/**
 * Create a not found response
 */
export function apiNotFound(message?: string): Response {
  return apiError(
    message || ERROR_MESSAGES.NOT_FOUND,
    404
  )
}

/**
 * Create a validation error response
 */
export function apiValidationError(details?: unknown): Response {
  return apiError(
    ERROR_MESSAGES.INVALID_INPUT,
    422,
    details
  )
}

/**
 * Create an internal server error response
 */
export function apiInternalError(message?: string, details?: unknown): Response {
  return apiError(
    message || ERROR_MESSAGES.GENERIC,
    500,
    details
  )
}

/**
 * Add rate limit headers to a response
 */
export function addRateLimitHeaders(
  response: Response,
  result: RateLimitResult
): Response {
  const newHeaders = new Headers(response.headers)
  newHeaders.set("X-RateLimit-Limit", String(result.limit))
  newHeaders.set("X-RateLimit-Remaining", String(result.remaining))
  newHeaders.set("X-RateLimit-Reset", String(result.reset))

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  })
}
