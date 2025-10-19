"use client"

import { Button } from "@/components/shadcnUI/button"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ReviewDetailHeaderProps {
  reviewId: number
  createdAt: Date
  dir: "ltr" | "rtl"
  translations: {
    back: string
    reviewNumber: string
    createdOn: string
  }
}

export function ReviewDetailHeader({ 
  reviewId, 
  createdAt, 
  dir, 
  translations 
}: ReviewDetailHeaderProps) {
  return (
    <div className={cn("flex items-center gap-4", dir === "rtl" && "flex-row-reverse")}>
      <Button asChild variant="outline" size="sm">
        <Link href="/dashboard/reviews">
          <ArrowLeft className={cn("h-4 w-4", dir === "rtl" ? "ml-2" : "mr-2")} />
          {translations.back}
        </Link>
      </Button>
      <div className={cn(dir === "rtl" && "text-right")}>
        <h1 className="text-2xl font-bold">
          {translations.reviewNumber} #{reviewId}
        </h1>
        <p className="text-muted-foreground">
          {translations.createdOn} {createdAt.toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
