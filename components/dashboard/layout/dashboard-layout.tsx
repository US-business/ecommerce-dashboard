"use client"

import type React from "react"

import { useState } from "react"

import { redirect, usePathname, useRouter } from "next/navigation"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAuth } from "@/lib/stores"
import { Button } from "@/components/shadcnUI/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/shadcnUI/sheet"
import { Menu, LogOut, LayoutDashboard } from "lucide-react"
import { Sidebar } from "./sidebar"
import { LanguageToggle } from "@/components/language-toggle"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"



function BurgerButton({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }) {
  const { dir } = useI18nStore()
  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen} >
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("shrink-0 md:hidden z-40 bg-transparent", dir === "rtl" ? "right-4" : "left-4")}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={dir === "rtl" ? "right" : "left"}  className="flex flex-col p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}



interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { t, dir } = useI18nStore()
  const { user, isLoading, isSuperAdmin, signOut } = useAuth()
  const { status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (isLoading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push(`/${dir === 'rtl' ? 'ar' : 'en'}/signin`)
    return null
  }





  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      // Use the auth context's signOut method
      await signOut()
      router.replace("/")
      // The code below won't execute because the server will redirect
    } catch (error) {
      console.error("Logout error:", error)
      // Only redirect on the client if something goes wrong
      router.replace("/")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800/40"> {/* Main container */}

      {/* Desktop sidebar */}
      <div className={cn("hidden md:block fixed inset-y-0 z-50 w-64", dir === "rtl" ? "right-0" : "left-0")}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className={cn(dir === "rtl" ? "md:pr-64" : "md:pl-64")}>
        {/* Header */}
        <header
          className={cn(
            "sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-20 sm:bg-transparent sm:px-6",
          )}
        >
          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.push("/dashboard")}
            disabled={sidebarOpen}
            className={cn("md:hidden", dir === "rtl" ? "ml-2" : "mr-2", "cursor-pointer")}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="">{t("common.dashboard")}</span>
          </Button>
          {/* Logo and title */}
          <div className={cn("flex-1", dir === "rtl" && "text-right")}>
            <div className="text-sm text-muted-foreground hidden lg:block md:block">
              {dir === "rtl"
                ? `(${isSuperAdmin ? t("users.superAdmin") : t("users.viewer")}) ${user.username} ،مرحباً`
                : `Welcome, ${user.username} (${isSuperAdmin ? t("users.superAdmin") : t("users.viewer")})`}
            </div>
          </div>
          <LanguageToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn("")}
          >
            <LogOut className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
            {isLoggingOut ? t("common.loading") : t("auth.logout")}
          </Button>
          <BurgerButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:px-6 sm:py-0 mt-3">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
