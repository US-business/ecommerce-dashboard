import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { getOrderById } from "@/lib/actions/orders"
import PrintButton from "./_components/PrintButton"
import en from "@/lib/i18n/translations/en.json"
import ar from "@/lib/i18n/translations/ar.json"
import { cn } from "@/lib/utils"

const translations = { en, ar } as const

interface InvoicePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams
  
  const cookieStore = await cookies()
  const locale = (cookieStore.get("preferred-locale")?.value || "ar") as 'ar' | 'en'
  const dir = locale === "ar" ? "rtl" : "ltr"
  const t = translations[locale].orders
  
  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  return (
    <div className="bg-white text-black p-8 relative" dir={dir}>
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
        <div className={cn(
          "flex justify-between items-start mb-8",
          dir === "rtl" ? "flex-row-reverse" : ""
        )}>
          <div>
            <h1 className="text-3xl font-bold">{t.invoice}</h1>
            <p className="text-gray-500">{t.orderNumber}{order.id}</p>
          </div>
          <div className={cn(
            dir === "rtl" ? "text-left" : "text-right"
          )}>
            <h2 className="text-xl font-bold">{t.companyName}</h2>
            <p>{t.companyAddress}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-2">{t.billTo}:</h3>
            <p>{order.user?.username}</p>
            <p>{order.user?.email}</p>
            <p>{order.shippingAddress}</p>
          </div>
          <div className={cn(
            dir === "rtl" ? "text-left" : "text-right"
          )}>
            <p><span className="font-bold">{t.invoiceDate}:</span> {new Date().toLocaleDateString(locale)}</p>
            <p><span className="font-bold">{t.orderDate}:</span> {order.createdAt ? new Date(order.createdAt).toLocaleDateString(locale) : "N/A"}</p>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gray-100">
              <th className={cn(
                "p-2",
                dir === "rtl" ? "text-right" : "text-left"
              )}>{t.item}</th>
              <th className="p-2 text-center">{t.quantity}</th>
              <th className={cn(
                "p-2",
                dir === "rtl" ? "text-left" : "text-right"
              )}>{t.price}</th>
              <th className={cn(
                "p-2",
                dir === "rtl" ? "text-left" : "text-right"
              )}>{t.total}</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id} className="border-b">
                <td className={cn(
                  "p-2",
                  dir === "rtl" ? "text-right" : "text-left"
                )}>{locale === "ar" ? item.product?.nameAr : item.product?.nameEn}</td>
                <td className="p-2 text-center">{item.quantity}</td>
                <td className={cn(
                  "p-2",
                  dir === "rtl" ? "text-left" : "text-right"
                )}>EGP {Number(item.price).toFixed(2)}</td>
                <td className={cn(
                  "p-2",
                  dir === "rtl" ? "text-left" : "text-right"
                )}>EGP {(item.quantity * Number(item.price)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={cn(
          "flex",
          dir === "rtl" ? "justify-start" : "justify-end"
        )}>
          <div className="w-1/3">
            <div className={cn(
              "flex justify-between mb-2",
              dir === "rtl" ? "flex-row-reverse" : ""
            )}>
              <span>{t.subtotal}:</span>
              <span>EGP {Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className={cn(
              "flex justify-between mb-2",
              dir === "rtl" ? "flex-row-reverse" : ""
            )}>
              <span>{t.shipping}:</span>
              <span>EGP {Number(order.shippingCost || 0).toFixed(2)}</span>
            </div>
            {order.discountAmount && Number(order.discountAmount) > 0 && (
              <div className={cn(
                "flex justify-between mb-2 text-green-600",
                dir === "rtl" ? "flex-row-reverse" : ""
              )}>
                <span>{t.discount}:</span>
                <span>-EGP {Number(order.discountAmount).toFixed(2)}</span>
              </div>
            )}
            <div className={cn(
              "flex justify-between font-bold text-xl border-t pt-2",
              dir === "rtl" ? "flex-row-reverse" : ""
            )}>
              <span>{t.total}:</span>
              <span>EGP {Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-gray-500">
          <p>{t.thankYou}</p>
        </div>
      </div>
    </div>
  )
}
