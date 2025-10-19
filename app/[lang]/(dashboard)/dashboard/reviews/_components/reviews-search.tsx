"use client"

import { Input } from "@/components/shadcnUI/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewsSearchProps {
  search: string
  onSearchChange: (value: string) => void
  placeholder: string
  title: string
  dir: "ltr" | "rtl"
}

export function ReviewsSearch({ 
  search, 
  onSearchChange, 
  placeholder, 
  title,
  dir 
}: ReviewsSearchProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn(dir === "rtl" && "text-right")}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search
            className={cn("absolute top-2.5 h-4 w-4 text-muted-foreground", dir === "rtl" ? "right-3" : "left-3")}
          />
          <Input
            placeholder={placeholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(dir === "rtl" ? "pr-10 text-right" : "pl-10")}
          />
        </div>
      </CardContent>
    </Card>
  )
}
