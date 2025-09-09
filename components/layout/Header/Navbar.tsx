import { LanguageToggle } from '@/components/language-toggle'
import { Separator } from '@/components/shadcnUI/separator'
import { cn } from '@/lib/utils'
import { Mail, MessageCircleMore } from 'lucide-react'
import React from 'react'
import AboutLink from './AboutLink'
import DashboardLink from './DashboardLink'
import ContactLink from './ContactLink'

export const Navbar = () => {

   return (
      <nav className={cn("bg-purple-50 w-full")}>
         <div className={cn("container mx-auto h-8 flex items-center justify-between")}>
            <ContactLink />
            <div className={cn("flex items-center justify-between gap-5 h-6")}>
               <DashboardLink />
               <LanguageToggle />
               {/* <Separator orientation="vertical" className="h-9 bg-gray-400" /> */}
               <AboutLink />
            </div>
         </div>
      </nav>
      )
}
