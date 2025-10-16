"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { ChevronRight, Phone, Mail, MapPin, Package, RotateCcw, Ruler, ShoppingCart, CreditCard, Truck, Shield, FileText, Headphones } from "lucide-react"

type LinkItem = {
  name: string
  href: string
  external?: boolean
  icon?: any
}

interface CustomerServiceSectionProps {
  dir: string
  lang?: string
  className?: string
}

export function CustomerServiceSection({ dir, lang = 'en', className = '' }: CustomerServiceSectionProps) {

  const customerService: LinkItem[] = [
    { name: dir === 'rtl' ? "تتبع الطلبات" : "Order Tracking", href: "/user-orders", icon: Package },
    { name: dir === 'rtl' ? "سياسة الإرجاع" : "Return Policy", href: "/returns", icon: RotateCcw },
    { name: dir === 'rtl' ? "دليل المقاسات" : "Size Guide", href: "/size-guide", icon: Ruler },
    { name: dir === 'rtl' ? "كيفية الشراء" : "How to Buy", href: "/how-to-buy", icon: ShoppingCart },
    { name: dir === 'rtl' ? "طرق الدفع" : "Payment Methods", href: "/payment-methods", icon: CreditCard },
    { name: dir === 'rtl' ? "الشحن والتوصيل" : "Shipping Info", href: "/shipping", icon: Truck },
    { name: dir === 'rtl' ? "الخصوصية" : "Privacy Policy", href: `/${lang}/privacy`, icon: Shield },
    { name: dir === 'rtl' ? "الشروط والأحكام" : "Terms & Conditions", href: `/${lang}/terms`, icon: FileText }
  ]

  return (
    <div className={cn(dir === 'rtl' ? "text-right" : "text-left", className)}>
      <h3 className={cn(
        "text-base font-semibold text-foreground mb-5 pb-2 border-b border-border flex items-center gap-2",
        dir === 'rtl' ? "flex-row-reverse" : "flex-row"
      )}>
        <Headphones className="w-4 h-4 text-primary" />
        {dir === 'rtl' ? "خدمة العملاء" : "Customer Service"}
      </h3>
      <ul className="space-y-3">
        {customerService.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className={cn(
                "group text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 text-sm",
                dir === 'rtl' ? "flex-row-reverse" : "flex-row"
              )}
            >
              {link.icon && (
                <link.icon className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              )}
              <ChevronRight className={cn(
                "w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0",
                dir === 'rtl' && "rotate-180"
              )} />
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CustomerServiceSection