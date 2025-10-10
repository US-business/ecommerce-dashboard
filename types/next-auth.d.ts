import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id?: number
      email: string
      name?: string | null
      image?: string | null
      role?: "super_admin" | "viewer"
      username?: string
    }
  }

  interface User {
    id?: number
    email: string
    name?: string | null
    image?: string | null
    role?: "super_admin" | "viewer"
    username?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number
    role?: "super_admin" | "viewer"
    username?: string
    email?: string
  }
}