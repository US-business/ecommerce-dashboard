"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { ChevronRight, Home, Package, Grid3x3, Tag, BookOpen, Users, Phone, HelpCircle, Zap } from "lucide-react"

type LinkItem = {
  name: string
  href: string
  external?: boolean
  icon?: any
}

interface QuickLinksSectionProps {
  dir: string
  className?: string
  lang: string | "ar" | "en"
}

export function QuickLinksSection({ dir, className = '', lang = "ar" }: QuickLinksSectionProps) {

  const quickLinks: LinkItem[] = [
    { name: dir === 'rtl' ? "الرئيسية" : "Home", href: "/", icon: Home },
    { name: dir === 'rtl' ? "المنتجات" : "Products", href: `/${lang}/products`, icon: Package },
    { name: dir === 'rtl' ? "العروض" : "Offers", href: `/${lang}/offers`, icon: Tag },
    { name: dir === 'rtl' ? "المدونة" : "Blog", href: `/${lang}/blog`, icon: BookOpen },
    { name: dir === 'rtl' ? "من نحن" : "About", href: `/${lang}/about`, icon: Users },
    { name: dir === 'rtl' ? "اتصل بنا" : "Contact", href: `/${lang}/contact`, icon: Phone },
    { name: dir === 'rtl' ? "الأسئلة الشائعة" : "FAQ", href: `/${lang}/faq`, icon: HelpCircle },
    { name: dir === 'rtl' ? "الشروط والأحكام" : "Terms", href: `/${lang}/terms`, icon: HelpCircle },
    { name: dir === 'rtl' ? "سياسة الخصوصية" : "Privacy", href: `/${lang}/privacy`, icon: HelpCircle }
  ]

  return (
    <div className={cn(dir === 'rtl' ? "text-right" : "text-left", className)}>
      <h3 className={cn(
        "text-base font-semibold text-foreground mb-5 pb-2 border-b border-border flex items-center gap-2",
      )}>
        <Zap className="w-4 h-4 text-primary" />
        {dir === 'rtl' ? "روابط سريعة" : "Quick Links"}
      </h3>
      <ul className="space-y-3">
        {quickLinks.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className={cn(
                "group text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 text-sm",
              )}
            >
              {link.icon && (
                <link.icon className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              )}
              <ChevronRight className={cn(
                "w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0",
              )} />
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default QuickLinksSection