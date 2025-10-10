"use client"
import { Package } from 'lucide-react'
import React from 'react'
import { usePathname, useRouter } from "next/navigation"


const LogoLink = () => {
   const router = useRouter()

   const handleLogoClick = () => {
      router.push("/")
   }

   return (
      <>
         {/* Logo */}
         <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleLogoClick}>
            {/* <ShoppingCart className="h-6 w-6 text-primary" /> */}
            <Package className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg hidden sm:inline-block">E-Commerce</span>
         </div>
      </> 
   )
}

export default LogoLink