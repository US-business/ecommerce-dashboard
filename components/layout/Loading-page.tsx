"use client"
import { useI18nStore } from '@/lib/stores/i18n-store'
import React, { useEffect } from 'react'
import { useAuth } from '@/lib/stores'
import { useAppStore } from '@/lib/stores/app-store'

type LoadingPageProps = {
   title: string
}


const LoadingPage = (props: LoadingPageProps) => {
   const { title } = props
   const { user, isLoading } = useAuth()
   const { t } = useI18nStore()
   const { isLoadingPage } = useAppStore()


   if (isLoadingPage) {

      if (isLoading) {
         return (
            <div className="min-h-screen flex items-center justify-center">
               <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>{t("common.loading")}</p>
               </div> 
            </div>
         )
      }

      if (user) {
         return (
            <div className="min-h-screen flex items-center justify-center">
               <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>{`Redirecting to ${title} ...`}</p>
               </div>
            </div>
         )
      }
   } else {
      return null 
   }

}

export default LoadingPage