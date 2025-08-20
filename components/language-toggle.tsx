"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { locales, localeNames } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

export function LanguageToggle() {
  const { locale, setLocale, dir } = useI18nStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn(dir === "rtl" && "flex-row-reverse")}>
          <Globe className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
          {localeNames[locale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => setLocale(loc)}
            className={cn(locale === loc ? "bg-accent" : "", loc === "ar" && "text-right")}
          >
            {localeNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
