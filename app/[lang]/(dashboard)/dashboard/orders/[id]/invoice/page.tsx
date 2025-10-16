import { notFound } from "next/navigation"
import { getOrderById } from "@/lib/actions/orders"
import PrintButton from "./_components/PrintButton"

interface InvoicePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams
  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  return (
    <div className="bg-white text-black p-8 relative">
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            .invoice-container, .invoice-container * {
              visibility: visible;
            }
            .invoice-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .no-print {
              display: none;
            }
          }
        `
      }} />

      <div className="invoice-container">
        <PrintButton />
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Invoice</h1>
            <p className="text-gray-500">Order #{order.id}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">E-commerce Inc.</h2>
            <p>123 Main St, Anytown, USA</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-2">Bill To:</h3>
            <p>{order.user?.username}</p>
            <p>{order.user?.email}</p>
            <p>{order.shippingAddress}</p>
          </div>
          <div className="text-right">
            <p><span className="font-bold">Invoice Date:</span> {new Date().toLocaleDateString()}</p>
            <p><span className="font-bold">Order Date:</span> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</p>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-center">Quantity</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.product?.nameEn}</td>
                <td className="p-2 text-center">{item.quantity}</td>
                <td className="p-2 text-right">EGP {Number(item.price).toFixed(2)}</td>
                <td className="p-2 text-right">EGP {(item.quantity * Number(item.price)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-1/3">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>EGP {Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>EGP {Number(order.shippingCost).toFixed(2)}</span>
            </div>
            {order.discountAmount && Number(order.discountAmount) > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>Discount:</span>
                <span>-EGP {Number(order.discountAmount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-xl border-t pt-2">
              <span>Total:</span>
              <span>EGP {Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-gray-500">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  )
}
