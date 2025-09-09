"use client"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import LoadingPage from '@/components/layout/Loading-page'
import { useAppStore } from '@/lib/stores'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {

   return (
      <>
         <ProtectedRoute requiredRole="super_admin">
            <DashboardLayout>
               {children}
            </DashboardLayout>
         </ProtectedRoute>
      </>
   )
}

export default Layout