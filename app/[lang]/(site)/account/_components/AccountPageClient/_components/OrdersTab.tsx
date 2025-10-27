import { TabsContent } from "@/components/shadcnUI/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcnUI/card";
import { Button } from "@/components/shadcnUI/button";
import { cn } from "@/lib/utils";
// import { UserOrders } from "../../../user-orders/_components/UserOrders";
import { UserOrders } from "../../../../user-orders/_components/UserOrders";
import { Order } from "./types";

interface OrdersTabProps {
  orders: Order[];
  dir: "rtl" | "ltr";
  safeDictionary: any;
  dictionary: any;
  lang: string;
  onStartShopping: () => void;
}

export function OrdersTab({ orders, dir, safeDictionary, dictionary, lang, onStartShopping }: OrdersTabProps) {
  return (
    <TabsContent value="orders" className="space-y-6">
      <Card>
        <CardHeader dir={dir}>
          <CardTitle dir={dir}>{safeDictionary.account.orders.title}</CardTitle>
          <CardDescription dir={dir}>
            {safeDictionary.account.orders.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <UserOrders orders={orders} dictionary={dictionary} lang={lang} />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {safeDictionary.account.general.noOrdersYet}
              </p>
              <Button
                className="mt-4"
                onClick={onStartShopping}
              >
                {safeDictionary.account.general.startShopping}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
