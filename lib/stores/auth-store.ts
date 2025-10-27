import { create } from 'zustand'
import { getCurrentUser } from "@/lib/auth/actions"
import { signOut as nextAuthSignOut } from "next-auth/react"

interface User {
  id: number
  username: string
  email: string
  role: "super_admin" | "viewer"
  createdAt: Date | null
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isSuperAdmin: boolean
  isViewer: boolean
  loadUser: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isSuperAdmin: false,
  isViewer: false,

  loadUser: async () => {
    try {
      set({ isLoading: true })
      const currentUser = await getCurrentUser()
      set({ 
        user: currentUser,
        isSuperAdmin: currentUser?.role === "super_admin",
        isViewer: currentUser?.role === "viewer",
        isLoading: false 
      })
    } catch (error) {
      console.error("Error loading user:", error)
      set({ 
        user: null,
        isSuperAdmin: false,
        isViewer: false,
        isLoading: false 
      })
    }
  },

  signOut: async () => {
    try {
      await nextAuthSignOut({ redirect: false })
      set({ 
        user: null,
        isSuperAdmin: false,
        isViewer: false 
      })
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }
}))
