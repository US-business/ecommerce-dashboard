/**
 * Runtime Environment Checks
 * Safe to use in both client and server components
 * 
 * Note: These checks use process.env.NODE_ENV which is replaced at build time
 * by Next.js, so they work in both client and server environments
 */

/**
 * Check if we're in production environment
 */
export const isProduction = process.env.NODE_ENV === "production"

/**
 * Check if we're in development environment
 */
export const isDevelopment = process.env.NODE_ENV === "development"

/**
 * Check if we're in test environment
 */
export const isTest = process.env.NODE_ENV === "test"

/**
 * Check if code is running on the server
 */
export const isServer = typeof window === "undefined"

/**
 * Check if code is running on the client (browser)
 */
export const isClient = typeof window !== "undefined"
