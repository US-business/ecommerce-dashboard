import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcnUI/card"
import { Badge } from "@/components/shadcnUI/badge"
import { Button } from "@/components/shadcnUI/button"
import { ArrowLeft, User, Phone, MapPin, Package, CreditCard, Printer } from "lucide-react"
import Link from "next/link"
import { getOrderById } from "@/lib/actions/orders"
import { UpdateOrderStatus } from "../_components/UpdateOrderStatus"
import { OrderNotes } from "../_components/OrderNotes"

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = params
  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      paid: "bg-green-100 text-green-800 border-green-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    } as const;

    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
            <p className="text-muted-foreground">Created on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/dashboard/orders/${order.id}/invoice`} target="_blank">
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Link>
        </Button>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader> 
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-medium">#{order.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Status:</span>
              <UpdateOrderStatus orderId={order.id} currentStatus={order.status as any} />
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <Badge className={getStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span>{order.paymentType}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Method:</span>
              <span>{order.shippingMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Created At:</span>
              <span>{order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>EGP {Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>EGP {Number(order.shippingCost).toFixed(2)}</span>
            </div>
            {order.coupon && (
              <div className="flex justify-between text-green-600">
                <span>Coupon ({order.coupon.code}):</span>
                {order.coupon.discountType === 'percentage'
                  ? <span> -{order.coupon.discountValue}%</span>
                  : <span> -EGP {Number(order.coupon.discountValue).toFixed(2)}</span>
                }
              </div>
            )}
            {order?.discountAmount && Number(order?.discountAmount) > 0 && !order.coupon && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-EGP {Number(order?.discountAmount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>EGP {Number(order?.totalAmount).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="font-medium">{order.user?.username || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="font-medium">{order.user?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {order.user?.phoneNumber || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Shipping Address</label>
              <p className="font-medium flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                {order.shippingAddress}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{item.product?.nameEn || 'N/A'}</h4>
                  <p className="text-sm text-muted-foreground">{item.product?.nameAr || ''}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity} × EGP {Number(item.price).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">EGP {(item.quantity * Number(item.price)).toFixed(2)}</p>
                </div>
              </div>
            ))}

            {/* Order Total */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span>EGP {Number(order.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
              <p className="font-medium">{order.paymentType}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
              <Badge className={getStatusColor(order.paymentStatus)}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Internal Notes */}
      <OrderNotes orderId={order.id} initialNotes={order.notes as any} />

    </div>
  )
}
