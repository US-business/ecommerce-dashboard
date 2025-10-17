"use client"
import React from 'react'
import { LogOut, User, LayoutDashboard, LogIn, ShoppingCart, Info, X, Search, Package, Sun, Moon, Monitor, Heart } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useScroll } from "@/hooks/use-scroll"
import { cn } from "@/lib/utils"
import { Button } from "@/components/shadcnUI/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu"
import { useI18nStore } from "@/lib/stores/i18n-store"
import { useAuthStore } from "@/lib/stores/auth-store"


const UserListLink = () => {
   const { t } = useI18nStore()
   const { user, signOut } = useAuthStore()
   const router = useRouter()


   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" size="sm" className={cn("gap-2 rounded-full w-9 h-9 p-0 sm:w-auto sm:h-auto sm:p-2 sm:rounded-md")}>
                  <User className="h-4 w-4" />
                  <span className={cn("hidden sm:inline-block")}>{user ? user.username : t("common.account")}</span>
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
               {user ? (
                  <>
                     <DropdownMenuItem onClick={() => router.push("/account")} className={cn("cursor-pointer")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>{t("common.myAccount")}</span>
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={() => signOut()} className={cn("cursor-pointer text-red-600 hover:text-red-700")}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{t("auth.signOut")}</span>
                     </DropdownMenuItem>
                  </>
               ) : (
                  <DropdownMenuItem onClick={() => router.push("/signin")} className={cn("cursor-pointer")}>
                     <LogIn className="mr-2 h-4 w-4" />
                     <span>{t("auth.signIn")}</span>
                  </DropdownMenuItem>
               )}
            </DropdownMenuContent>
         </DropdownMenu>

      </>
   )
}

export default UserListLink