"use client"

import { Badge } from "@/components/shadcnUI/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card"
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
import { ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/shadcnUI/button"

const statusColors = {
   pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
   processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
   shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
   delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
   cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
} as const

interface RecentOrdersClientProps {
   orders: any[];
   lang: string;
   dictionary: any;
}

export function RecentOrdersClient({ orders, lang, dictionary }: RecentOrdersClientProps) {
   return (
      <Card className="col-span-full">
         <CardHeader>
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                     <ShoppingBag className="h-5 w-5 text-primary" />
                     {dictionary.dashboard.recent_orders.title}
                  </CardTitle>
                  <CardDescription>
                     Latest orders from your customers
                  </CardDescription>
               </div>
               <Button variant="outline" size="sm" asChild>
                  <Link href={`/${lang}/dashboard/orders`} className="flex items-center gap-1">
                     {dictionary.dashboard.recent_orders.view_all}
                     <ArrowRight className="h-4 w-4" />
                  </Link>
               </Button>
            </div>
         </CardHeader>
         <CardContent>
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
                     <TableCell>
                        {new Intl.NumberFormat("en-US", {
                           style: "currency",
                           currency: "USD"
                        }).format(Number(order.totalAmount))}
                     </TableCell>
                     <TableCell>{formatDate(order.createdAt)}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         </CardContent>
      </Card>
   )
}