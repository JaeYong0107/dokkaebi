import orderData from "../../../../data/orders.json";
import type { OrderRecord } from "@/features/order/types";

export const sampleOrders: OrderRecord[] = orderData as OrderRecord[];

export function getOrderById(id: string) {
  return sampleOrders.find((order) => order.id === id) ?? null;
}
