"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/shadcnUI/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcnUI/dropdown-menu"
import { Globe } from "lucide-react"
import { locales, localeNames } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

export function LanguageToggle() {
  const { locale, setLocale, dir } = useI18nStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={cn(" text-purple-900 hover:text-purple-900  rounded-none focus-visible:ring-0 hover:bg-purple-200 cursor-pointer")}>
          <Globe className={cn("h-4 w-4 text-purple-900")} />
          {localeNames[locale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={dir === "rtl" ? "start" : "end"} className={cn("bg-purple-100 text-purple-900")}>
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => setLocale(loc)}
            className={cn(locale === loc ? "bg-purple-200 text-purple-900" : "", loc === "ar" && "text-right","hover:bg-purple-200")}
          >
            {localeNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
