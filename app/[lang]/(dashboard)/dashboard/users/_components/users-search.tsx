"use client"

import { useI18nStore } from "@/lib/stores/i18n-store"
import { Input } from "@/components/shadcnUI/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface UsersSearchProps {
  search: string
  onSearchChange: (value: string) => void
}

export function UsersSearch({ search, onSearchChange }: UsersSearchProps) {
  const { t, dir } = useI18nStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn(dir === "rtl" && "text-right")}>{t("common.search")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search
            className={cn("absolute top-2.5 h-4 w-4 text-muted-foreground", dir === "rtl" ? "right-3" : "left-3")}
          />
          <Input
            placeholder={dir === "rtl" ? "البحث في المستخدمين..." : "Search users..."}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(dir === "rtl" ? "pr-10 text-right" : "pl-10")}
          />
        </div>
      </CardContent>
    </Card>
  )
}
