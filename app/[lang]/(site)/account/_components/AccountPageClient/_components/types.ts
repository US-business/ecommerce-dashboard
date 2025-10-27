import { User } from "@/types/user";

export type Order = Awaited<ReturnType<typeof import("@/lib/actions/orders").getUserOrders>>[0];

export interface AccountPageClientProps {
  user: User;
  dictionary: any;
  orders: Order[];
  lang: string;
}

export interface UserWithProvider extends User {
  provider?: string;
}
