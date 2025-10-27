"use client"
import { Button } from '@/components/shadcnUI/button'
import { useI18nStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import { Info } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const AboutLink = () => {

   const { t, locale, dir } = useI18nStore()

   return (
      <>
         <Link href={`/${locale}/about`}>
            <Button 
               variant="ghost" 
               size="sm" 
               className={cn(
                  "gap-1.5 sm:gap-2 text-slate-100 hover:text-amber-400 hover:bg-slate-700/50 rounded-md focus-visible:ring-0 cursor-pointer transition-all h-8 px-2 sm:px-3",
               )}
            >
               <Info className="h-4 w-4 flex-shrink-0" />
               <span className={cn("hidden sm:inline-block font-medium text-sm")}>{t("common.about")}</span>
            </Button>
         </Link>
      </>
   )
}

export default AboutLink