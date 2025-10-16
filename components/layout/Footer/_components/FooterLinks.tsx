"use client"

import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

type LinkItem = {
  name: string
  href: string
  external?: boolean
}

interface FooterLinksProps {
  quickLinks: LinkItem[]
  customerService: LinkItem[]
  dir: string
  className?: string
}

export function FooterLinks({ quickLinks, customerService, dir, className = '' }: FooterLinksProps) {
  return (
    <>
      {/* Quick Links */}
      <div className={cn(dir === 'rtl' ? "text-right" : "text-left", className)}>
        <h3 className="text-lg font-semibold text-white mb-6">
          {dir === 'rtl' ? "روابط سريعة" : "Quick Links"}
        </h3>
        <ul className="space-y-3">
          {quickLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-2"
              >
                <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Customer Service */}
      <div className={cn(dir === 'rtl' ? "text-right" : "text-left")}>
        <h3 className="text-lg font-semibold text-white mb-6">
          {dir === 'rtl' ? "خدمة العملاء" : "Customer Service"}
        </h3>
        <ul className="space-y-3">
          {customerService.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-2"
              >
                <span className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Contact Info */}
        <div className="mt-8 space-y-3">
          <div className={cn(
            "flex items-center gap-3 text-slate-400",
            dir === 'rtl' ? "flex-row-reverse" : "flex-row"
          )}>
            <Phone className="w-4 h-4 text-primary flex-shrink-0" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className={cn(
            "flex items-center gap-3 text-slate-400",
            dir === 'rtl' ? "flex-row-reverse" : "flex-row"
          )}>
            <Mail className="w-4 h-4 text-primary flex-shrink-0" />
            <span>support@ecommerce.com</span>
          </div>
          <div className={cn(
            "flex items-center gap-3 text-slate-400",
            dir === 'rtl' ? "flex-row-reverse" : "flex-row"
          )}>
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span>
              {dir === 'rtl' ? "123 شارع التجارة، المدينة" : "123 Commerce St, City"}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default FooterLinks
