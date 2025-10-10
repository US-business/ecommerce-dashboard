
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcnUI/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcnUI/accordion";
import Image from "next/image";
import { Badge } from "@/components/shadcnUI/badge";

// Infer the type from the server action return type
type Order = Awaited<ReturnType<typeof import("@/lib/actions/orders").getUserOrders>>[0];

interface UserOrdersProps {
  orders: Order[];
  dictionary: any;
  lang: string;
}

export function UserOrders({ orders, dictionary, lang }: UserOrdersProps) {

  const t = dictionary.account.orders;

  if (orders.length === 0) {
    return <p className="text-center text-muted-foreground py-10">{t.empty}</p>;
  }

  const formatDate = (dateString: Date | null | undefined, locale: string = 'en-US') => {
    if (!dateString) return "";
    const localeMap: { [key: string]: string } = {
      ar: 'ar-EG',
      en: 'en-US'
    };
    return new Date(dateString).toLocaleDateString(localeMap[locale] || 'en-US', {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  const formatCurrency = (amount: string | null | undefined, locale: string = 'en') => {
    if (!amount) return locale === 'ar' ? "٠٫٠٠ ج.م" : "EGP 0.00";
    const formattedAmount = parseFloat(amount).toFixed(2);
    return locale === 'ar' ? `${formattedAmount} ج.م` : `EGP ${formattedAmount}`;
  };



  return (
    <Accordion type="single" collapsible className="w-full">
      {orders.map((order) => (
        <AccordionItem value={`order-${order.id}`} key={order.id}>
          <AccordionTrigger> 
            <div className="flex justify-between w-full pr-4">
              <span>{t.order} #{order.id}</span>
              <span className="hidden md:block">{formatDate(order?.createdAt, lang)}</span>
              <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
              <span>{formatCurrency(order.totalAmount, lang)}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 bg-muted/40 rounded-md">
              <h4 className="font-semibold mb-4">{t.orderDetails}</h4>
              <div className="mb-4">
                <p><strong>{t.shippingAddress}:</strong> {order.shippingAddress}</p>
                <p><strong>{t.totalAmount}:</strong> {formatCurrency(order.totalAmount, lang)}</p>
                <p><strong>{t.status}:</strong> {order.status}</p>
              </div>
              <h5 className="font-semibold mb-2">{t.items}</h5>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.product}</TableHead>
                    <TableHead>{t.quantity}</TableHead>
                    <TableHead>{t.price}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="flex items-center">
                        <Image
                          src={item.product?.images[0] || "/placeholder.jpg"}
                          alt={lang === 'ar' ? item.product?.nameAr || item.product?.nameEn || "صورة المنتج" : item.product?.nameEn || item.product?.nameAr || "Product image"}
                          width={50}
                          height={50}
                          className="rounded-md mr-4"
                        />
                        {lang === 'ar' ? item.product?.nameAr || item.product?.nameEn : item.product?.nameEn || item.product?.nameAr}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.price, lang)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
