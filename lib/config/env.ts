import "server-only"
import { z } from "zod"

/**
 * Environment Variables Validation Schema
 * Validates all required environment variables at startup
 * Prevents runtime errors due to missing or invalid configuration
 * 
 * ⚠️ SERVER-ONLY: This file can only be imported in server-side code
 */
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Application URLs
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
  NEXTAUTH_URL: z.string().url().optional(),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // NextAuth Configuration
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET must be at least 32 characters for security"),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z
    .string()
    .min(1, "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is required"),

  // Admin Credentials (for seeding - optional in development)
  SUPER_ADMIN_EMAIL: z.string().email("SUPER_ADMIN_EMAIL must be a valid email").optional(),
  SUPER_ADMIN_PASSWORD: z
    .string()
    .min(8, "SUPER_ADMIN_PASSWORD must be at least 8 characters")
    .optional(),
})

/**
 * Validated environment variables
 * Use this instead of process.env for type safety
 */
export type Env = z.infer<typeof envSchema>

/**
 * Parse and validate environment variables
 * Throws detailed error if validation fails
 */
function parseEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => {
        return `  ❌ ${issue.path.join(".")}: ${issue.message}`
      })

      console.error("\n🚨 Environment Variables Validation Failed:\n")
      console.error(issues.join("\n"))
      console.error("\n💡 Please check your .env.local file and ensure all required variables are set.\n")

      throw new Error("Invalid environment variables")
    }
    throw error
  }
}

/**
 * Validated and typed environment variables
 * Import this in your app instead of using process.env
 * 
 * @example
 * import { env } from '@/lib/config/env'
 * const dbUrl = env.DATABASE_URL // Type-safe and validated
 */
export const env = parseEnv()

/**
 * Re-export runtime environment checks for server-side convenience
 * These are also available from "@/lib/config/runtime-env" for client/server usage
 */
export { isProduction, isDevelopment, isTest, isServer, isClient } from "./runtime-env"
