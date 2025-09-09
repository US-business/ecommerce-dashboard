"use client"
import { useI18nStore } from '@/lib/stores'
import { Mail, MessageCircleMore } from 'lucide-react'
import React from 'react'

const ContactLink = () => {

   const { t } = useI18nStore()

   return (
      <>
         <div className='flex items-center gap-6 text-xs text-purple-950'>
            <a href="" className='flex items-center gap-2 '>
               <Mail className='w-5 h-5' />
               {t('common.contact')}
            </a>
            <a href="01285659191" className='flex items-center gap-2' aria-label="Call us: 01285659191 - 01064999141">
               <MessageCircleMore className='  w-5 h-5' />
               <span className="links-text">Call us: 01285659191 - 01064999141</span>
            </a>
         </div>
      </>
   )
}

export default ContactLink