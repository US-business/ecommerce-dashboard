"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcnUI/table"
import { Search, Eye, Trash2, X, Loader2 } from "lucide-react"
import { deleteOrder } from "@/lib/actions/orders"
import { toast } from "@/hooks/use-toast"

// Using a relaxed type here because server returns decimal fields as strings and may include nulls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DashboardOrder = any

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

interface OrdersListProps {
  initialOrders: DashboardOrder[]
}

export function OrdersList({ initialOrders }: OrdersListProps) {
  const router = useRouter()
  const [orders, setOrders] = useState(initialOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setOrders(initialOrders)
  }, [initialOrders])

  useEffect(() => {
    const handler = setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search)
      if (searchQuery) {
        searchParams.set("search", searchQuery)
      } else {
        searchParams.delete("search")
      }
      router.replace(`${window.location.pathname}?${searchParams.toString()}`)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery, router])

  const handleDelete = (orderId: number) => {
    startTransition(async () => {
      try {
        const result = await deleteOrder(orderId)
        if (result.success) {
          setOrders((prev) => prev.filter((order) => order.id !== orderId))
          toast({
            title: "Order deleted",
            description: "The order has been successfully deleted.",
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to delete order.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        })
      }
    })
  }

  const clearSearch = () => setSearchQuery("")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground">Manage customer orders and track their status</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by order ID, customer name, email, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
            <span>
              {`${orders.length} order${orders.length !== 1 ? "s" : ""} found`}
            </span>
            {searchQuery && <span>Search: "{searchQuery}"</span>}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? "No orders found matching your search." : "No orders found."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Coupon</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.user?.username || "Unknown"}</p>
                          <p className="text-sm text-muted-foreground">{order.user?.email || `User #${order.userId}`}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[order.paymentStatus] || "bg-gray-100 text-gray-800"}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            EGP {Number(order.totalAmount).toFixed(2)}
                          </div>
                          {order.coupon && (
                            <div className="text-sm text-green-600">
                              -{order.coupon.code} (EGP {Number(order.discountAmount).toFixed(2)})
                            </div>
                          )}
                          {order.discountAmount && Number(order.discountAmount) > 0 && !order.coupon && (
                            <div className="text-sm text-green-600">
                              -EGP {Number(order.discountAmount).toFixed(2)} discount
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.coupon ? (
                          <div className="text-sm">
                            <div className="font-medium text-green-600">{order.coupon.code}</div>
                            <div className="text-xs text-gray-500">
                              {order.coupon.discountType === 'percentage' 
                                ? `${order.coupon.discountValue}%` 
                                : `EGP ${order.coupon.discountValue}`}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No coupon</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/dashboard/orders/${order.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(order.id)}
                            disabled={isPending}
                            className="text-red-600 hover:text-red-700"
                          >
                            {isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
