import React from 'react'

import { useI18nStore } from "@/lib/stores/i18n-store"
const AboutPage = () => {
   return (
      <>
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <h1 className="text-4xl font-bold mb-4">About Us</h1>
               <p className="text-lg">This is a multilingual e-commerce admin dashboard.</p>
            </div>
         </div>
      </>
   )
}

export default AboutPage