import { getCurrentUser } from "@/lib/auth/actions"

/**
 * Get current authenticated user
 * This is a wrapper around getCurrentUser for backward compatibility
 * @deprecated Use getCurrentUser from @/lib/auth/actions instead
 */
export async function getUnifiedUser() {
  return await getCurrentUser()
}