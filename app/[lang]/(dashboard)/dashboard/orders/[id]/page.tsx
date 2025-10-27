import { notFound } from "next/navigation"
import { getOrderById } from "@/lib/actions/orders"
import { OrderNotes } from "../_components/OrderNotes"
import { OrderHeader } from "./_components/OrderHeader"
import { OrderDetailsCard } from "./_components/OrderDetailsCard"
import { PricingDetailsCard } from "./_components/PricingDetailsCard"
import { CustomerInfoCard } from "./_components/CustomerInfoCard"
import { OrderItemsCard } from "./_components/OrderItemsCard"
import { PaymentInfoCard } from "./_components/PaymentInfoCard"

interface OrderDetailPageProps {
    params: Promise<{
        id: string
        lang?: string
    }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const resolvedParams = await params;
    const { id } = resolvedParams

    const order = await getOrderById(id)

    if (!order) {
        notFound()
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <OrderHeader orderId={order.id} createdAt={order.createdAt} />

            {/* Order Details & Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <OrderDetailsCard order={order} />
                <PricingDetailsCard order={order} />
            </div>

            {/* Customer Information */}
            <CustomerInfoCard order={order} />

            {/* Order Items */}
            <OrderItemsCard order={order} />

            {/* Payment Information */}
            <PaymentInfoCard order={order} />

            {/* Internal Notes */}
            <OrderNotes orderId={order.id} initialNotes={order.notes as any} />
        </div>
    )
}
