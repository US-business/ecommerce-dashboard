"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewCommentCardProps {
  comment: string
  title: string
  dir: "ltr" | "rtl"
}

export function ReviewCommentCard({ comment, title, dir }: ReviewCommentCardProps) {
  if (!comment) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse text-right")}>
          <MessageSquare className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("p-4 bg-muted rounded-lg", dir === "rtl" && "text-right")}>
          <p className="italic">"{comment}"</p>
        </div>
      </CardContent>
    </Card>
  )
}
