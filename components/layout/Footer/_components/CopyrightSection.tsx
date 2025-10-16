"use client"

import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface CopyrightSectionProps {
  dir: string
  lang?: string
  className?: string
}

export function CopyrightSection({ dir, lang = 'en', className = '' }: CopyrightSectionProps) {
  return (
    <div className={cn(
      "flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-sm",
      dir === 'rtl' ? "md:flex-row-reverse" : "md:flex-row",
      className
    )}>
      <div className={cn(
        "flex items-center gap-2",
        dir === 'rtl' ? "flex-row-reverse" : "flex-row"
      )}>
        <span>
          © 2024 {dir === 'rtl' ? "متجر إلكتروني" : "E-Commerce"}.
          {dir === 'rtl' ? " جميع الحقوق محفوظة" : " All rights reserved"}.
        </span>
      </div>

      <div className={cn(
        "flex items-center gap-2",
        dir === 'rtl' ? "flex-row-reverse" : "flex-row"
      )}>
        <span>{dir === 'rtl' ? "صنع بـ" : "Made with"}</span>
        <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
        <span>{dir === 'rtl' ? "في السعودية" : "in Saudi Arabia"}</span>
        <span className="text-base">🇸🇦</span>
      </div>
    </div>
  )
}

export default CopyrightSection