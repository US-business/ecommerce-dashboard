
"use client"

import { DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import StatCard from "./StatCard"
import { useI18nStore } from "@/lib/stores/i18n-store"

interface DashboardStatsClientProps {
   totalOrders: number
   totalRevenue: number
   totalUsers: number
   totalProducts: number
   dictionary: any
}

export function DashboardStatsClient({
   totalOrders,
   totalRevenue,
   totalUsers,
   totalProducts,
   dictionary
}: DashboardStatsClientProps) {
   const { dir } = useI18nStore()
   
   const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
   })

   return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
         <StatCard
            title={dictionary.dashboard.stats.total_revenue}
            value={formatter.format(totalRevenue)}
            icon={<DollarSign className="h-5 w-5 text-primary" />}
            trend={{ value: 12.5, isPositive: true }}
            dir={dir}
         />
         
         <StatCard
            title={dictionary.dashboard.stats.total_orders}
            value={totalOrders.toLocaleString()}
            icon={<ShoppingCart className="h-5 w-5 text-primary" />}
            trend={{ value: 8.2, isPositive: true }}
            dir={dir}
         />
         
         <StatCard
            title={dictionary.dashboard.stats.total_customers}
            value={totalUsers.toLocaleString()}
            icon={<Users className="h-5 w-5 text-primary" />}
            trend={{ value: 3.1, isPositive: false }}
            dir={dir}
         />
         
         <StatCard
            title={dictionary.dashboard.stats.total_products}
            value={totalProducts.toLocaleString()}
            icon={<Package className="h-5 w-5 text-primary" />}
            dir={dir}
         />
      </div>
   )
}