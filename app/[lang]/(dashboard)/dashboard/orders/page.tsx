import { getOrders, searchOrders } from "@/lib/actions/orders";
import { OrdersList } from "./_components/OrdersList";

export default async function OrdersPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;

  const orders = search ? await searchOrders(search) : await getOrders();

  return (
    <OrdersList initialOrders={orders} />
  );
}