import { getOrders, searchOrders } from "@/lib/actions/orders";
import { OrdersList } from "./_components/OrdersList";

export default async function OrdersPage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  const orders = search ? await searchOrders(search) : await getOrders();

  return (
    <OrdersList initialOrders={orders} />
  );
}