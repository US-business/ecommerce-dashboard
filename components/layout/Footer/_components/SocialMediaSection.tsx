"use client"

import { Button } from "@/components/shadcnUI/button"
import { cn } from "@/lib/utils"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Smartphone,
} from "lucide-react"

interface SocialMediaSectionProps {
  dir: string
  lang?: string
  className?: string
}

export function SocialMediaSection({ dir, lang = 'en', className = '' }: SocialMediaSectionProps) {

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "X" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ]

  return (
    <div className={cn(
      "flex flex-col md:flex-row justify-between items-start md:items-center gap-2",
      "md:flex-row",
      className
    )}>
      {/* Social Links */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4">
          {dir === 'rtl' ? "تابعنا" : "Follow Us"}
        </h3>
        <div className={cn(
          "flex gap-3",
          "flex-row"
        )}>
          {socialLinks.map((social, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              className="w-10 h-10 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              asChild
            >
              <a href={social.href} aria-label={social.label}>
                <social.icon className="w-4 h-4" />
              </a>
            </Button>
          ))}
        </div>
      </div>

 
    </div>
  )
}

export default SocialMediaSection