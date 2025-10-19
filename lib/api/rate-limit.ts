import "server-only"

/**
 * Rate Limiting Configuration
 * Prevents API abuse and spam by limiting requests per IP
 */

/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or similar distributed cache
 */
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimit = new Map<string, RateLimitEntry>()

/**
 * Rate limit configuration options
 */
export interface RateLimitOptions {
  /**
   * Unique identifier for this rate limit (e.g., 'api', 'auth', 'upload')
   */
  uniqueTokenPerInterval: string
  
  /**
   * Time window in milliseconds
   * @default 60000 (1 minute)
   */
  interval?: number
  
  /**
   * Maximum number of requests allowed in the interval
   * @default 10
   */
  limit?: number
}

/**
 * Rate limiter result
 */
export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check if request should be rate limited
 * 
 * @param identifier - Unique identifier for the client (usually IP address)
 * @param options - Rate limit configuration
 * @returns Rate limit result with remaining requests and reset time
 * 
 * @example
 * ```typescript
 * const identifier = request.headers.get('x-forwarded-for') || 'anonymous'
 * const result = await rateLimit(identifier, {
 *   uniqueTokenPerInterval: 'api',
 *   interval: 60000, // 1 minute
 *   limit: 10 // 10 requests per minute
 * })
 * 
 * if (!result.success) {
 *   return Response.json(
 *     { error: 'Too many requests' },
 *     { status: 429, headers: { 'Retry-After': String(result.reset) } }
 *   )
 * }
 * ```
 */
export async function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const {
    uniqueTokenPerInterval,
    interval = 60000, // 1 minute default
    limit = 10, // 10 requests default
  } = options

  // Create unique key for this identifier and token
  const key = `${uniqueTokenPerInterval}:${identifier}`
  const now = Date.now()

  // Get or create rate limit entry
  let entry = rateLimit.get(key)

  // Clean up old entries (garbage collection)
  if (rateLimit.size > 10000) {
    const keysToDelete: string[] = []
    for (const [k, v] of rateLimit.entries()) {
      if (now > v.resetTime) {
        keysToDelete.push(k)
      }
    }
    keysToDelete.forEach(k => rateLimit.delete(k))
  }

  // Reset if interval has passed
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + interval,
    }
    rateLimit.set(key, entry)
  }

  // Increment counter
  entry.count++

  const remaining = Math.max(0, limit - entry.count)
  const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000)

  return {
    success: entry.count <= limit,
    limit,
    remaining,
    reset: resetInSeconds,
  }
}

/**
 * Clear all rate limit entries for a specific identifier
 * Useful for testing or manual reset
 */
export function clearRateLimit(identifier: string, uniqueTokenPerInterval: string): void {
  const key = `${uniqueTokenPerInterval}:${identifier}`
  rateLimit.delete(key)
}

/**
 * Clear all rate limit entries
 * Useful for testing
 */
export function clearAllRateLimits(): void {
  rateLimit.clear()
}

/**
 * Get rate limit stats for debugging
 */
export function getRateLimitStats(): {
  totalKeys: number
  activeKeys: number
} {
  const now = Date.now()
  let activeKeys = 0

  for (const [, entry] of rateLimit.entries()) {
    if (now <= entry.resetTime) {
      activeKeys++
    }
  }

  return {
    totalKeys: rateLimit.size,
    activeKeys,
  }
}
