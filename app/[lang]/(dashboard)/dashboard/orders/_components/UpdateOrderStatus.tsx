'use client';

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/lib/actions/orders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcnUI/select";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useI18nStore } from "@/lib/stores/i18n-store";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface UpdateOrderStatusProps {
  orderId: number;
  currentStatus: OrderStatus;
}

const statuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

export function UpdateOrderStatus({ orderId, currentStatus }: UpdateOrderStatusProps) {
  const { t } = useI18nStore();
  const [isPending, startTransition] = useTransition();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);

  const handleStatusChange = (newStatus: OrderStatus) => {
    setSelectedStatus(newStatus);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        toast({ title: t("orders.success"), description: t("orders.statusUpdated") });
      } else {
        toast({ title: t("orders.error"), description: result.error, variant: "destructive" });
        setSelectedStatus(currentStatus); // Revert on failure
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedStatus} onValueChange={handleStatusChange} disabled={isPending}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("orders.changeStatus")} />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {t(`orders.status${status.charAt(0).toUpperCase() + status.slice(1)}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isPending && <Loader2 className="h-5 w-5 animate-spin" />}
    </div>
  );
}
