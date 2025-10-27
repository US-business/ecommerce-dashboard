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
import { useI18nStore } from "@/lib/stores/i18n-store"
import { cn } from "@/lib/utils"

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
  const { t, dir } = useI18nStore()
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
            title: t("orders.orderDeleted"),
            description: t("orders.orderDeletedDesc"),
          })
        } else {
          toast({
            title: t("orders.error"),
            description: t("orders.deleteError"),
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: t("orders.error"),
          description: t("orders.unexpectedError"),
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
          <h1 className="text-2xl font-bold">{t("orders.ordersManagement")}</h1>
          <p className="text-muted-foreground">{t("orders.subtitle")}</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>{t("orders.searchOrders")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className={cn(
              "absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4",
              dir === 'rtl' ? 'right-3' : 'left-3'
            )} />
            <Input
              placeholder={t("orders.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(dir === 'rtl' ? 'pr-10 pl-10' : 'pl-10 pr-10')}
              dir={dir}
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
              {`${orders.length} ${orders.length !== 1 ? t("orders.ordersFounds") : t("orders.ordersFound")}`}
            </span>
            {searchQuery && <span>{t("orders.searchLabel")} "{searchQuery}"</span>}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("orders.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? t("orders.noOrdersFound") : t("orders.noOrders")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("orders.orderId")}</TableHead>
                    <TableHead>{t("orders.customer")}</TableHead>
                    <TableHead>{t("orders.status")}</TableHead>
                    <TableHead>{t("orders.paymentStatus")}</TableHead>
                    <TableHead>{t("orders.total")}</TableHead>
                    <TableHead>{t("orders.coupon")}</TableHead>
                    <TableHead>{t("orders.date")}</TableHead>
                    <TableHead className={cn(dir === 'rtl' ? 'text-left' : 'text-right')}>{t("orders.actions")}</TableHead>
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
                          <span className="text-gray-400 text-sm">{t("orders.noCoupon")}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className={cn(dir === 'rtl' ? 'text-left' : 'text-right')}>
                        <div className={cn(
                          "flex items-center gap-2",
                          dir === 'rtl' ? 'justify-start' : 'justify-end'
                        )}>
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
