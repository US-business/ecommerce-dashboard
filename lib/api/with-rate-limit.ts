import "server-only"
import { checkRateLimit, type RateLimitOptions } from "./rate-limit"
import { apiRateLimitError, addRateLimitHeaders } from "./response"

/**
 * Higher-order function to add rate limiting to API routes
 * 
 * @example
 * ```typescript
 * export const POST = withRateLimit(
 *   async (request: Request) => {
 *     // Your API logic here
 *     return Response.json({ success: true })
 *   },
 *   {
 *     uniqueTokenPerInterval: 'api-products',
 *     interval: 60000, // 1 minute
 *     limit: 10 // 10 requests per minute
 *   }
 * )
 * ```
 */
export function withRateLimit(
  handler: (request: Request) => Promise<Response> | Response,
  options: RateLimitOptions
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    // Get client identifier (IP address)
    const identifier = 
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous"

    // Check rate limit
    const rateLimitResult = await checkRateLimit(identifier, options)

    // If rate limit exceeded, return error
    if (!rateLimitResult.success) {
      return apiRateLimitError(rateLimitResult)
    }

    // Execute handler
    const response = await handler(request)

    // Add rate limit headers to response
    return addRateLimitHeaders(response, rateLimitResult)
  }
}

/**
 * Preset rate limit configurations
 */
export const RATE_LIMITS = {
  /**
   * Strict limit for authentication endpoints
   * 5 requests per 15 minutes
   */
  AUTH: {
    uniqueTokenPerInterval: "api-auth",
    interval: 15 * 60 * 1000, // 15 minutes
    limit: 5,
  },

  /**
   * Standard limit for regular API endpoints
   * 60 requests per minute
   */
  API: {
    uniqueTokenPerInterval: "api-standard",
    interval: 60 * 1000, // 1 minute
    limit: 60,
  },

  /**
   * Relaxed limit for read-only endpoints
   * 120 requests per minute
   */
  READ: {
    uniqueTokenPerInterval: "api-read",
    interval: 60 * 1000, // 1 minute
    limit: 120,
  },

  /**
   * Strict limit for write operations
   * 20 requests per minute
   */
  WRITE: {
    uniqueTokenPerInterval: "api-write",
    interval: 60 * 1000, // 1 minute
    limit: 20,
  },

  /**
   * Very strict limit for upload endpoints
   * 10 requests per 5 minutes
   */
  UPLOAD: {
    uniqueTokenPerInterval: "api-upload",
    interval: 5 * 60 * 1000, // 5 minutes
    limit: 10,
  },

  /**
   * Extremely strict limit for sensitive operations
   * 3 requests per hour
   */
  SENSITIVE: {
    uniqueTokenPerInterval: "api-sensitive",
    interval: 60 * 60 * 1000, // 1 hour
    limit: 3,
  },
} as const
