"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewRatingCardProps {
  rating: number
  title: string
  dir: "ltr" | "rtl"
}

export function ReviewRatingCard({ rating, title, dir }: ReviewRatingCardProps) {
  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`h-5 w-5 ${index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-2 text-lg font-medium">{rating}/5</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn(dir === "rtl" && "text-right")}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("flex justify-center py-6", dir === "rtl" && "flex-row-reverse")}>
        {getRatingStars(rating)}
      </CardContent>
    </Card>
  )
}
