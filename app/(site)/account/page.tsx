"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/lib/stores"
import { useRouter } from "next/navigation"
import { Button } from "@/components/shadcnUI/button"

export default function MyAccountPage() {
  const router = useRouter()
  const { user, isLoading, loadUser, signOut } = useAuthStore()

  useEffect(() => {
    // لو الصفحة اتفتحت، حاول تحمل بيانات المستخدم
    loadUser()
  }, [loadUser])

  const handleSignOut = async () => {
    await signOut()
    router.push("/") // بعد تسجيل الخروج روح للصفحة الرئيسية
  }

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>
  }

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p>You are not logged in.</p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded-md shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>
      <div className="mb-2"><strong>Username:</strong> {user.username}</div>
      <div className="mb-2"><strong>Email:</strong> {user.email}</div>
      <div className="mb-2"><strong>Role:</strong> {user.role}</div>
      <div className="mb-4"><strong>Joined:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</div>
      <Button variant="destructive" onClick={handleSignOut}>Sign Out</Button>
    </div>
  )
}
