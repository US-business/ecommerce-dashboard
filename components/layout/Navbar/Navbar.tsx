"use client"
import { LanguageToggle } from '@/components/language-toggle'
import { Separator } from '@/components/shadcnUI/separator'
import { cn } from '@/lib/utils'
import { Mail, MessageCircleMore } from 'lucide-react'
import React from 'react'
import AboutLink from './_components/AboutLink'
import DashboardLink from '../Header/pages-link/DashboardLink'
import ContactLink from './_components/ContactLink'
import { useI18nStore } from '@/lib/stores'

export const Navbar = () => {

   return (
      <nav className={cn(
         "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 w-full shadow-md",
         "border-b border-slate-700/50",
      )}>
         <div className={cn(
            "container mx-auto px-3 sm:px-6 lg:px-8",
            "h-10 sm:h-10 lg:h-9",
            "flex items-center justify-between",
         )}>
            {/* Left Side - Contact Section */}
            <div className={cn(
               "flex items-center gap-2",
            )}>
               {/* Contact Link - Show on medium screens and up */}
                  <ContactLink />

            </div>
            
            {/* Right Side Actions */}
            <div className={cn(
               "flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-5",
            )}>
               <DashboardLink />
               <Separator 
                  orientation="vertical" 
                  className="h-5 bg-slate-600/50 hidden sm:block" 
               />
               <LanguageToggle variant="navbar" />
               <Separator 
                  orientation="vertical" 
                  className="h-5 bg-slate-600/50 hidden sm:block" 
               />
               <AboutLink />
            </div>
         </div>
      </nav>
   )
}
