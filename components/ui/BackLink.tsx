"use client"
import React from 'react'
import { Button } from '../shadcnUI/button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type Props = {
   dir: string
   className?: string
   text?: string
   href?: string
}



const BackLink = ({ dir = "ltr", className, text , href }: Props) => {
   const router = useRouter()
   return (
      <>
         <Button
            variant="ghost"
            onClick={() => href ? router.push(href) : router.back()}
            className={cn( dir === "rtl" && "flex-row-reverse" , className)}
         >
            {dir === "rtl" ? <>
            <span>{text || "العودة"}</span> 
            <ArrowLeft className={cn("h-4 w-4", dir === "rtl" ? "ml-2 rotate-180" : "mr-2")} />
            </> : <>
            <ArrowLeft className={cn("h-4 w-4", dir === "rtl" ? "mr-2" : "ml-2")} />
            <span>{text || "Back"}</span>
            </>}
         </Button>
      </>
   )
}

export default BackLink