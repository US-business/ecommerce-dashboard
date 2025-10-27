"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/shadcnUI/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcnUI/dropdown-menu"
import { Globe } from "lucide-react"
import { locales, localeNames, i18nConfig, type Locale } from "@/lib/i18n/i18n-config"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"

interface LanguageToggleProps {
  variant?: "default" | "navbar"
}

export function LanguageToggle({ variant = "default" }: LanguageToggleProps = {}) {
  const { locale, dir } = useI18nStore()
  const pathname = usePathname()
  const router = useRouter()

  const handleChangeLanguage = (newLocale: Locale) => {
    if (!pathname) return
    i18nConfig.saveLocale(newLocale)
    const segments = pathname.split("/")
    segments[1] = newLocale
    const newPath = segments.join("/")
    router.push(newPath)
  }

  const isNavbar = variant === "navbar"

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "gap-1.5 sm:gap-2",
            "h-8 sm:h-9",
            "px-2 sm:px-3",
            "min-w-[60px] sm:min-w-[80px]",
            "focus-visible:ring-0",
            "transition-colors",
            "rounded-md",
            isNavbar 
              ? "text-slate-100 hover:text-amber-400 hover:bg-slate-800/50 cursor-pointer" 
              : "hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="hidden sm:inline text-sm font-medium">{localeNames[locale]}</span>
          <span className="sm:hidden text-[11px] font-semibold">{locale.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={dir === "rtl" ? "start" : "end"} 
        sideOffset={8}
        className={cn(
          "w-36 sm:w-40",
          "min-w-[140px]",
          "z-[9999]",
          isNavbar && "bg-slate-800 border-slate-700"
        )}
        avoidCollisions={true}
        collisionPadding={8}
      >
        {locales.map((loc: Locale) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleChangeLanguage(loc)}
            className={cn(
              "cursor-pointer",
              "text-sm py-2.5 px-3",
              "flex items-center gap-2",
              isNavbar 
                ? cn(
                    "text-slate-100 hover:text-amber-400 hover:bg-slate-700/50",
                    locale === loc && "bg-amber-500/20 text-amber-400 font-semibold"
                  )
                : cn(
                    "hover:bg-accent hover:text-accent-foreground",
                    locale === loc && "bg-accent text-accent-foreground font-semibold"
                  ),
              loc === "ar" && "flex-row-reverse text-left"
            )}
          >
            <Globe className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1">{localeNames[loc]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
