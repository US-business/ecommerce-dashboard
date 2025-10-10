"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"
import { Button } from "@/components/shadcnUI/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/shadcnUI/dropdown-menu"
import { Globe } from "lucide-react"
import { locales, localeNames, i18nConfig, type Locale } from "@/lib/i18n/i18n-config"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"

export function LanguageToggle() {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={cn(" text-purple-900 hover:text-purple-900  rounded-none focus-visible:ring-0 hover:bg-purple-200 cursor-pointer")}>
          <Globe className={cn("h-4 w-4 text-purple-900")} />
          {localeNames[locale]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={dir === "rtl" ? "start" : "end"} className={cn("bg-purple-100 text-purple-900")}>
        {locales.map((loc: Locale) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleChangeLanguage(loc)}
            className={cn(locale === loc ? "bg-purple-200 text-purple-900" : "", loc === "ar" && "text-right","hover:bg-purple-200")}
          >
            {localeNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
