"use client"
import { Button } from '@/components/shadcnUI/button'
import { useAppStore, useAuthStore, useI18nStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import { LayoutDashboard } from 'lucide-react'
import { usePathname, useRouter } from "next/navigation"
import React from 'react'

const DashboardLink = () => {

   const { t, dir } = useI18nStore()
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
            <Button 
               variant="ghost" 
               size="sm" 
               onClick={handelGoToDashboard} 
               className={cn(
                  "flex items-center gap-1.5 sm:gap-2 text-slate-100 hover:text-amber-400 hover:bg-slate-700/50 rounded-md focus-visible:ring-0 cursor-pointer transition-all h-8 px-2 sm:px-3",
               )}
            >
               <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
               <span className="hidden sm:inline-block font-medium text-sm">{t("common.dashboard")}</span>
            </Button>
         )}
      </>
   )
}

export default DashboardLink