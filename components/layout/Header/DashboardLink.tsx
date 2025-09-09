"use client"
import { Button } from '@/components/shadcnUI/button'
import { useAppStore, useAuthStore, useI18nStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import { LayoutDashboard } from 'lucide-react'
import { usePathname, useRouter } from "next/navigation"
import React from 'react'

const DashboardLink = () => {

   const { t } = useI18nStore()
   const router = useRouter()
   const { setIsLoadingPage } = useAppStore();
   const { isSuperAdmin } = useAuthStore()


   const handelGoToDashboard = () => {
      router.push("/dashboard")
      setIsLoadingPage(true)
   }

   return (
      <>
         {isSuperAdmin && (
            <Button variant="ghost" size="sm" onClick={handelGoToDashboard} className={cn("gap-2 text-purple-900 hover:text-purple-950 rounded-none focus-visible:ring-0 hover:bg-purple-200 cursor-pointer")}>
               <LayoutDashboard className="h-4 w-4" />
               <span className="hidden sm:inline-block">{t("common.dashboard")}</span>
            </Button>
         )}
      </>
   )
}

export default DashboardLink