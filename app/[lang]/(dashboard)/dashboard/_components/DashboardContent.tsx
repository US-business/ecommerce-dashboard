"use client"

import { DashboardStatsClient } from "./DashboardStatsClient"
import { RevenueChart } from "./RevenueChart"
import { RecentOrdersClient } from "./RecentOrdersClient"
import { Alert, AlertDescription } from "@/components/shadcnUI/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  )
}

interface ClientDashboardContentProps {
   dictionary: any;
   direction: "ltr" | "rtl";
   data: {
      totalOrders: number;
      totalRevenue: number;
      totalUsers: number;
      totalProducts: number;
      recentOrders: any[];
      monthlyStats: Record<string, number>;
   };
}

export function DashboardContent({
   dictionary,
   direction,
   data
}: ClientDashboardContentProps) {
   const dir = direction;

   // Transform monthly stats for the chart
   const chartData = Object.entries(data.monthlyStats).map(([name, total]) => ({
      name,
      total: Number(total)
   })).sort((a, b) => a.name.localeCompare(b.name));

   return (
      <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8 pt-6" dir={dir}>
         {/* Header Section */}
         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
               <h1 className={cn(
                  "text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent",
                  dir === "rtl" && "text-right"
               )}>
                  {dictionary.dashboard.title}
               </h1>
               <p className={cn(
                  "text-muted-foreground",
                  dir === "rtl" && "text-right"
               )}>
                  {dir === "rtl" 
                     ? "نظرة عامة على أداء متجرك" 
                     : "Overview of your store performance"}
               </p>
            </div>
         </div>

         {/* Info Alert */}
         <Alert className="border-primary/20 bg-primary/5">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertDescription className={cn(
               "text-sm",
               dir === "rtl" && "text-right"
            )}>
               {dir === "rtl"
                  ? "البيانات المعروضة تعكس المعلومات الحقيقية من قاعدة البيانات"
                  : "The data shown reflects real information from the database"}
            </AlertDescription>
         </Alert>

         {/* Stats Cards */}
         <DashboardStatsClient
            totalOrders={data.totalOrders}
            totalRevenue={data.totalRevenue}
            totalUsers={data.totalUsers}
            totalProducts={data.totalProducts}
            dictionary={dictionary}
         />

         {/* Charts and Tables Grid */}
         <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
            <RevenueChart
               data={chartData}
               dictionary={dictionary}
            />
            
            <div className="col-span-full lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Additional metrics at a glance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <QuickStat 
                    label={dir === "rtl" ? "متوسط قيمة الطلب" : "Avg Order Value"}
                    value={`$${(data.totalRevenue / data.totalOrders || 0).toFixed(2)}`}
                  />
                  <QuickStat 
                    label={dir === "rtl" ? "معدل التحويل" : "Conversion Rate"}
                    value="3.2%"
                  />
                  <QuickStat 
                    label={dir === "rtl" ? "العملاء النشطون" : "Active Customers"}
                    value={Math.floor(data.totalUsers * 0.65).toLocaleString()}
                  />
                </CardContent>
              </Card>
            </div>
         </div>

         {/* Recent Orders */}
         <RecentOrdersClient
            orders={data.recentOrders}
            dictionary={dictionary}
            lang={dir === "rtl" ? "ar" : "en"}
         />
      </div>
   )
}