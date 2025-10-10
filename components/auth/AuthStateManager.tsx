"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useAuthStore } from "@/lib/stores"

export function AuthStateManager({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const { setNextAuthUser, reset } = useAuthStore()

  useEffect(() => {
    console.log("🔄 AuthStateManager: Session status changed:", { status, hasSession: !!session })
    
    if (status === "loading") {
      return
    }

    if (status === "authenticated" && session?.user) {
      console.log("✅ NextAuth session found, setting user:", session.user.email)
      setNextAuthUser(session.user)
    }
  }, [session, status, setNextAuthUser, reset])

  return <>{children}</>
}