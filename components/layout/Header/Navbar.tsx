import { LanguageToggle } from '@/components/language-toggle'
import { Separator } from '@/components/shadcnUI/separator'
import { cn } from '@/lib/utils'
import { Mail, MessageCircleMore } from 'lucide-react'
import React from 'react'
import AboutLink from './pages-link/AboutLink'
import DashboardLink from './pages-link/DashboardLink'
import ContactLink from './pages-link/ContactLink'

export const Navbar = () => {

   return (
      <nav className={cn("bg-purple-50 w-full")}>
         <div className={cn(
            "container mx-auto px-4 sm:px-6 lg:px-8",
            "h-8 sm:h-10 lg:h-8", 
            "flex items-center justify-between"
         )}>
            {/* Contact Section - Hide on very small screens */}
            <div className="hidden sm:block">
               <ContactLink />
            </div>
            
            {/* Mobile: Show only language toggle when contact is hidden */}
            <div className="flex sm:hidden items-center">
               <LanguageToggle />
            </div>
            
            {/* Right Side Actions */}
            <div className={cn(
               "flex items-center gap-2 sm:gap-3 lg:gap-5",
               "h-6"
            )}>
               <DashboardLink />
               <div className="hidden sm:block">
                  <LanguageToggle />
               </div>
               <AboutLink />
            </div>
         </div>
      </nav>
      )
}
