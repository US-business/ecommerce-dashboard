"use client"

import type { FC } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
  dir?: "ltr" | "rtl"
}

const StatCard: FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  description,
  dir = "ltr" 
}) => {
  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -mr-16 -mt-16" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn(
          "text-sm font-medium text-muted-foreground",
          dir === "rtl" && "text-right"
        )}>
          {title}
        </CardTitle>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className={cn(
          "text-3xl font-bold tracking-tight mb-1",
          dir === "rtl" && "text-right"
        )}>
          {value}
        </div>
        
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span className="font-medium">
              {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground">
              {dir === "rtl" ? "من الشهر الماضي" : "from last month"}
            </span>
          </div>
        )}
        
        {description && (
          <p className={cn(
            "text-xs text-muted-foreground mt-1",
            dir === "rtl" && "text-right"
          )}>
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default StatCard