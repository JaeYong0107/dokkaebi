import type { CustomerType } from "@/features/pricing/types";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PREPARING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

export type OrderItemSummary = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  imageEmoji: string;
  imageBg: string;
};

export type OrderRecord = {
  id: string;
  orderNumber: string;
  orderedAt: string;
  customerType: CustomerType;
  customerName: string;
  items: OrderItemSummary[];
  subtotal: number;
  shippingFee: number;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: string;
  recipient: string;
  trackingNumber?: string;
  courierName?: string;
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "결제 대기",
  PAID: "결제 완료",
  PREPARING: "상품 준비중",
  SHIPPING: "배송중",
  DELIVERED: "배송 완료",
  CANCELLED: "주문 취소"
};

export const ORDER_STATUS_TIMELINE: OrderStatus[] = [
  "PAID",
  "PREPARING",
  "SHIPPING",
  "DELIVERED"
];
