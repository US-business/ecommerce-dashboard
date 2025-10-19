"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewTimelineProps {
  createdAt: Date
  dir: "ltr" | "rtl"
  translations: {
    title: string
    reviewCreated: string
  }
}

export function ReviewTimeline({ createdAt, dir, translations }: ReviewTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse text-right")}>
          <Calendar className="h-5 w-5" />
          {translations.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("space-y-4", dir === "rtl" && "text-right")}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <p className="font-medium">{translations.reviewCreated}</p>
              <p className="text-sm text-muted-foreground">
                {createdAt.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
