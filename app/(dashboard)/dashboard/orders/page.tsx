"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { Button } from "@/components/shadcnUI/button"
import { Input } from "@/components/shadcnUI/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcnUI/table"
import { Search, Eye, Trash2, X, Loader2 } from "lucide-react"
import { getOrders, searchOrders, deleteOrder } from "@/lib/actions/orders"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { toast } from "@/hooks/use-toast"
import type { Order } from "@/lib/services/orders-mock"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Load initial orders
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true)
      try {
        const ordersData = await getOrders()
        setOrders(ordersData)
      } catch (error) {
        console.error("Error loading orders:", error)
        toast({
          title: "Error",
          description: "Failed to load orders.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim() === "") {
        // If search is empty, load all orders
        setIsSearching(true)
        try {
          const ordersData = await getOrders()
          setOrders(ordersData)
        } catch (error) {
          console.error("Error loading orders:", error)
        } finally {
          setIsSearching(false)
        }
      } else {
        // Perform search
        setIsSearching(true)
        try {
          const searchResults = await searchOrders(searchQuery)
          setOrders(searchResults)
        } catch (error) {
          console.error("Error searching orders:", error)
        } finally {
          setIsSearching(false)
        }
      }
    }

    const debounceTimer = setTimeout(performSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleDelete = (orderId: string) => {
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
            description: result.error || "Failed to delete order.",
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

  const clearSearch = () => {
    setSearchQuery("")
  }

  if (isLoading) {
    return (
        // <ProtectedRoute requiredRole="super_admin">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        // </ProtectedRoute>
    )
  }

  return (
      // <ProtectedRoute requiredRole="super_admin">
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
                  placeholder="Search by order ID, customer name, email, status, or product..."
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
                  {isSearching ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Searching...
                    </span>
                  ) : (
                    `${orders.length} order${orders.length !== 1 ? "s" : ""} found`
                  )}
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
                        <TableHead>Total</TableHead>
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
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[order.status]}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                          <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
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
      // </ProtectedRoute>
  )
}
