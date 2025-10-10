"use client"
import { useI18nStore } from '@/lib/stores'
import { Mail, MessageCircleMore } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const ContactLink = () => {

   const { t, locale } = useI18nStore()

   return (
      <>
         <div className='flex items-center gap-3 sm:gap-6 text-xs text-purple-950'>
            {/* Contact Link - Always visible */}
            <Link href={`/${locale}/contact`} className='flex items-center gap-1 sm:gap-2'>
               <Mail className='w-4 h-4 sm:w-5 sm:h-5' />
               <span className="hidden sm:inline-block">{t('common.contact')}</span>
            </Link>
            
            {/* Phone - Responsive display */}
            <a href="#" className='flex items-center gap-1 sm:gap-2' aria-label="Call us: 01285659191 - 01064999141">
               <MessageCircleMore className='w-4 h-4 sm:w-5 sm:h-5' />
               {/* Mobile: Show abbreviated */}
               <span className="links-text inline sm:hidden">Call us</span>
               {/* Desktop: Show full number */}
               <span className="links-text hidden sm:inline">Call us: 01285659191 - 01064999141</span>
            </a>
         </div> 
      </>
   )
}

export default ContactLink