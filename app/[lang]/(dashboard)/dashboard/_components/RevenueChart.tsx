"use client"

import { useState, useEffect } from "react"
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/shadcnUI/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/shadcnUI/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { TrendingUp } from "lucide-react"

interface RevenueChartProps {
   data: {
      name: string
      total: number
   }[]
   dictionary: any
}

const chartConfig = {
   total: {
      label: "Revenue",
      color: "hsl(var(--primary))",
   },
}

export function RevenueChart({ data, dictionary }: RevenueChartProps) {
   const [isMounted, setIsMounted] = useState(false)

   useEffect(() => {
      setIsMounted(true)
   }, [])

   if (!isMounted) {
      return (
         <Card className="col-span-full lg:col-span-4">
            <CardHeader>
               <CardTitle>{dictionary.dashboard.revenue_over_time}</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
               <div className="h-[350px] flex items-center justify-center">
                  <div className="animate-pulse text-muted-foreground">
                     Loading chart...
                  </div>
               </div>
            </CardContent>
         </Card>
      )
   }

   const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0)
   const avgRevenue = totalRevenue / data.length

   return (
      <Card className="col-span-full lg:col-span-4">
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <TrendingUp className="h-5 w-5 text-primary" />
               {dictionary.dashboard.revenue_over_time}
            </CardTitle>
            <CardDescription>
               Monthly revenue trends for the last 6 months
            </CardDescription>
         </CardHeader>
         <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
               <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                     dataKey="name"
                     tickLine={false}
                     axisLine={false}
                     className="text-xs"
                  />
                  <YAxis
                     tickLine={false}
                     axisLine={false}
                     tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                     className="text-xs"
                  />
                  <ChartTooltip
                     content={<ChartTooltipContent />}
                     cursor={{ fill: 'hsl(var(--muted))' }}
                  />
                  <Bar
                     dataKey="total"
                     fill="var(--color-total)"
                     radius={[8, 8, 0, 0]}
                  />
               </BarChart>
            </ChartContainer>
         </CardContent>
      </Card>
   )
}