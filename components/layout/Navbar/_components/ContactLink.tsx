"use client"
import { useI18nStore } from '@/lib/stores'
import { cn } from '@/lib/utils'
import { Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const ContactLink = () => {

   const { t, locale, dir } = useI18nStore()

   return (
      <>
         <div className={cn(
            'text-slate-100 flex items-center gap-2 sm:gap-3 md:gap-6 text-xs transition-colors',
         )}>
            {/* Contact Email Link */}
            <Link 
               href={`/${locale}/contact`} 
               className={cn(
                  'flex items-center gap-1 sm:gap-2 hover:text-amber-400 transition-colors px-2 py-1 rounded-md hover:bg-slate-800/50',
               )}
               title={t('common.contact')}
            >
               <Mail className='w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0' />
               <span className="hidden md:inline-block font-medium">{t('common.contact')}</span>
            </Link>
            
            {/* Phone Link - Hide on very small screens */}
            <a 
               href="tel:01285659191" 
               className={cn(
                  'hidden sm:flex items-center gap-1 sm:gap-2 hover:text-amber-400 transition-colors px-2 py-1 rounded-md hover:bg-slate-800/50',
               )}
               aria-label="Call us: 01285659191"
            >
               <Phone className='w-4 h-4 flex-shrink-0' />
               {/* Show abbreviated on medium, full on large */}
               <span className="links-text hidden lg:inline font-medium">
                  {dir === "rtl" ? "اتصل بنا: 01285659191" : "Call: 01285659191"}
               </span>
               <span className="links-text hidden md:inline lg:hidden font-medium">
                  {dir === "rtl" ? "اتصل" : "Call"}
               </span>
            </a>
         </div> 
      </>
   )
}

export default ContactLink