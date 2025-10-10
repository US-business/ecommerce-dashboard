"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Button } from "@/components/shadcnUI/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcnUI/select"
import { Badge } from "@/components/shadcnUI/badge"
import { Loader2, Package } from "lucide-react"
import { updateOrderStatus } from "@/lib/actions/orders"
import { toast } from "@/hooks/use-toast"
import type { Order } from "@/lib/services/orders-mock"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

interface OrderStatusFormProps {
  order: Order
}
 
export function OrderStatusForm({ order }: OrderStatusFormProps) {
  const [selectedStatus, setSelectedStatus] = useState<Order["status"]>(order.status)
  const [isPending, startTransition] = useTransition()

  const handleStatusUpdate = () => {
    if (selectedStatus === order.status) {
      toast({
        title: "No changes",
        description: "The status is already set to this value.",
      })
      return
    }

    startTransition(async () => {
      try {
        const result = await updateOrderStatus(Number(order.id), selectedStatus)
        if (result.success) {
          toast({
            title: "Status updated",
            description: `Order status has been updated to ${selectedStatus}.`,
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to update order status.",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Update Order Status
        </CardTitle> 
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Current Status</label>
          <div className="mt-1">
            <Badge className={statusColors[order.status]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">New Status</label>
          <Select value={selectedStatus} onValueChange={(value: Order["status"]) => setSelectedStatus(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleStatusUpdate} disabled={isPending || selectedStatus === order.status} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Status"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
