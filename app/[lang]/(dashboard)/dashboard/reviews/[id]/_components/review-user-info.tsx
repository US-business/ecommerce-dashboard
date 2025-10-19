"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewUserInfoProps {
  username: string
  email: string
  userId: number
  dir: "ltr" | "rtl"
  translations: {
    title: string
    username: string
    email: string
    userId: string
  }
}

export function ReviewUserInfo({ 
  username, 
  email, 
  userId, 
  dir, 
  translations 
}: ReviewUserInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("flex items-center gap-2", dir === "rtl" && "flex-row-reverse text-right")}>
          <User className="h-5 w-5" />
          {translations.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={cn("grid grid-cols-1 gap-4", dir === "rtl" && "text-right")}>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {translations.username}
            </label>
            <p className="font-medium">{username}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {translations.email}
            </label>
            <p className="font-medium">{email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {translations.userId}
            </label>
            <p className="font-medium">{userId}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
