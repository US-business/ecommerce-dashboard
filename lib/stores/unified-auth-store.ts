"use client"

import { create } from 'zustand'
import { signOut as nextAuthSignOut } from "next-auth/react"
import { useCartStore } from '@/lib/stores/cart-store'

interface User {
  id: number
  username: string
  email: string
  role: "super_admin" | "viewer"
  createdAt: Date | null
  image?: string | null
  provider?: string
  name?: string | null
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isSuperAdmin: boolean
  isViewer: boolean
  authType: 'nextauth' | null
  // Actions
  setNextAuthUser: (sessionUser: any) => void
  signOut: () => Promise<void>
  reset: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isLoading: false,
  isSuperAdmin: false,
  isViewer: false,
  authType: 'nextauth',

  // Set NextAuth user
  setNextAuthUser: (sessionUser: any) => {
    if (!sessionUser) return

    const { user: currentUser } = get()

    const nextAuthUser: User = {
      id: sessionUser.id,
      username: sessionUser.username || sessionUser.name || sessionUser.email?.split('@')[0] || "",
      email: sessionUser.email,
      role: sessionUser.role || "viewer",
      createdAt: new Date(),
      image: sessionUser.image,
      name: sessionUser.name,
      provider: 'google'
    }

    // Clear cart if different user
    if (currentUser && currentUser.email !== nextAuthUser.email) {
      console.log("🔄 Account switching detected")
      try {
        useCartStore.getState().clearCartForUserSwitch()
      } catch (error) {
        console.error("Error clearing cart:", error)
      }
    }

    console.log("📝 Setting NextAuth user:", nextAuthUser.email)
    set({
      user: nextAuthUser,
      isSuperAdmin: nextAuthUser.role === "super_admin",
      isViewer: nextAuthUser.role === "viewer",
      isLoading: false,
      authType: 'nextauth'
    })
  },

  

  // Sign out
  signOut: async () => {
    console.log("🚪 Signing out")

    // Reset state immediately
    get().reset()

    try {
      await nextAuthSignOut({ callbackUrl: '/', redirect: false })
      setTimeout(() => window.location.href = '/', 100)
    } catch (error) {
      console.error("Error signing out:", error)
      window.location.href = '/'
    }
  },

  // Reset state
  reset: () => {
    console.log("🔄 Resetting auth state")
    set({
      user: null,
      isSuperAdmin: false,
      isViewer: false,
      isLoading: false,
      authType: 'nextauth'
    })

    // Clear cart
    try {
      useCartStore.getState().clearCartForUserSwitch()
    } catch (error) {
      console.error("Error clearing cart on reset:", error)
    }
  }
}))

// Convenience hook
export const useAuth = () => {
  const store = useAuthStore()
  
  return {
    ...store,
    isAuthenticated: !!store.user,
    isNextAuth: store.authType === 'nextauth',
    isCustomAuth: false,
    userId: store.user?.id,
    userEmail: store.user?.email,
    userName: store.user?.name || store.user?.username,
    userRole: store.user?.role,
    userImage: store.user?.image,
    userProvider: store.user?.provider
  }
}

export type { User, AuthState }