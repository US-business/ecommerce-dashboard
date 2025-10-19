"use client"

import { cn } from "@/lib/utils"

interface ReviewsHeaderProps {
  title: string
  description: string
  dir: "ltr" | "rtl"
}

export function ReviewsHeader({ title, description, dir }: ReviewsHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
      <div className={cn(dir === "rtl" && "text-right")}>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
