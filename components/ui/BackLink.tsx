"use client"
import React from 'react'
import { Button } from '../shadcnUI/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type Props = {
   dir: string
   className?: string
   text?: string
   href?: string
}



const BackLink = ({ dir = "ltr", className, text, href }: Props) => {
   const router = useRouter()
   return (
      <>
         <Button
            variant="ghost"
            onClick={() => href ? router.push(href) : router.back()}
            className={cn(dir === "rtl" && "flex-row-reverse", className)}
         >
            {dir === "rtl" ? <span>{text || "العودة"}</span> : <span>{text || "Back"}</span>}
            {dir === "ltr" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}

         </Button>
      </>
   )
}

export default BackLink