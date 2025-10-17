"use client"
import { Button } from '@/components/shadcnUI/button'
import { useI18nStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import { Info } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const AboutLink = () => {

   const { t, dir } = useI18nStore()

   return (
      <>
         <Link href="/about">
            <Button variant="ghost" size="sm" className="gap-2 text-purple-900 hover:text-purple-950 rounded-none focus-visible:ring-0 hover:bg-purple-200 cursor-pointer">
               <Info className="h-4 w-4" />
               <span className={cn("hidden  sm:inline-block ")}>{t("common.about")}</span>
            </Button>
         </Link>
      </>
   )
}

export default AboutLink