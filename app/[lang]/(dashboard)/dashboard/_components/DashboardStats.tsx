import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { CreditCard, Package, Users } from "lucide-react"

interface DashboardStatsProps {
   totalOrders: number
   totalRevenue: number
   totalUsers: number
   totalProducts: number
   dictionary: any
}

export function DashboardStats({
   totalOrders,
   totalRevenue,
   totalUsers,
   totalProducts,
   dictionary
}: DashboardStatsProps) {
   const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
   })

   return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  {dictionary.dashboard.stats.total_revenue}
               </CardTitle>
               <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{formatter.format(totalRevenue)}</div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  {dictionary.dashboard.stats.total_orders}
               </CardTitle>
               <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  {dictionary.dashboard.stats.total_customers}
               </CardTitle>
               <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  {dictionary.dashboard.stats.total_products}
               </CardTitle>
               <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{totalProducts.toLocaleString()}</div>
            </CardContent>
         </Card>
      </div>
   )
}