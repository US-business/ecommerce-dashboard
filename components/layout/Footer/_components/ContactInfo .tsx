"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { ChevronRight, Phone, Mail, MapPin } from "lucide-react"

type LinkItem = {
  name: string
  href: string
  external?: boolean
}


interface ContactInfoProps {
  dir: string
  lang?: string
  className?: string
}


export function ContactInfo({ dir, lang = 'en', className = '' }: ContactInfoProps) {
  return (
    <div className={cn( "space-y-4", className)}>
      <h3 className="text-base font-semibold text-foreground pb-2 border-b border-border">
        {dir === 'rtl' ? "اتصل بنا" : "Contact Us"}
      </h3>
      <div className="space-y-3">
        <div className={cn(
          "flex items-center gap-3 text-muted-foreground text-sm",
          "flex-row"
        )}>
          <Phone className="w-4 h-4 text-primary flex-shrink-0" />
          <span>+1 (555) 123-4567</span>
        </div>
        <div className={cn(
          "flex items-center gap-3 text-muted-foreground text-sm",
          "flex-row"
        )}>
          <Mail className="w-4 h-4 text-primary flex-shrink-0" />
          <span>support@ecommerce.com</span>
        </div>
        <div className={cn(
          "flex items-start gap-3 text-muted-foreground text-sm",
          "flex-row"
        )}>
          <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <span>
            {dir === 'rtl' ? "123 شارع التجارة، المدينة" : "123 Commerce St, City"}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo