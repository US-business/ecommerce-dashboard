"use client"
import React from "react"
import { useScroll } from "@/hooks/use-scroll"
import { cn } from "@/lib/utils"


type ProductsResponse = {
   children: React.ReactNode
}

function ScrolledHeader({ children }: ProductsResponse) {
   const { scrolled, visible } = useScroll()

   return (
      <>
         <header
            className={cn(
               "sticky top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b transition-all duration-300",
               scrolled ? "shadow-md" : "shadow-none",
               visible ? "translate-y-0" : "-translate-y-full"
            )}
         >
            {children}
         </header> 
      </>
   )
}

export default ScrolledHeader