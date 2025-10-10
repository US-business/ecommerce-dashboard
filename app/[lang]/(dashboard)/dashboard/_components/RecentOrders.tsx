import { Badge } from "@/components/shadcnUI/badge"
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/shadcnUI/table"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

const statusColors = {
   pending: "bg-yellow-100 text-yellow-800",
   processing: "bg-blue-100 text-blue-800",
   shipped: "bg-purple-100 text-purple-800",
   delivered: "bg-green-100 text-green-800",
   cancelled: "bg-red-100 text-red-800",
}

interface RecentOrdersProps {
   orders: any[]
   lang: string
   dictionary: any
}

export function RecentOrders({ orders, lang, dictionary }: RecentOrdersProps) {
   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
               {dictionary.dashboard.recent_orders.title}
            </h2>
            <Link
               href={`/${lang}/dashboard/orders`}
               className="text-sm text-blue-600 hover:underline"
            >
               {dictionary.dashboard.recent_orders.view_all}
            </Link>
         </div>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {orders.map((order) => (
                  <TableRow key={order.id}>
                     <TableCell className="font-medium">
                        <Link
                           href={`/${lang}/dashboard/orders/${order.id}`}
                           className="hover:underline"
                        >
                           #{order.id}
                        </Link>
                     </TableCell>
                     <TableCell>
                        <div>
                           <p className="font-medium">{order.user?.username || "Unknown"}</p>
                           <p className="text-sm text-muted-foreground">
                              {order.user?.email || `User #${order.userId}`}
                           </p>
                        </div>
                     </TableCell>
                     <TableCell>
                        <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                           {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                     </TableCell>
                     <TableCell>{formatter.format(Number(order.totalAmount))}</TableCell>
                     <TableCell>{formatDate(order.createdAt)}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   )
}

const formatter = new Intl.NumberFormat("en-US", {
   style: "currency",
   currency: "USD",
})