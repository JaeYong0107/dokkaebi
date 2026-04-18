export type OrderSummary = {
  orderNumber: string;
  subtotalAmount: number;
  shippingFee: number;
  totalAmount: number;
  orderStatus:
    | "PENDING"
    | "PAID"
    | "PREPARING"
    | "SHIPPING"
    | "DELIVERED"
    | "CANCELLED";
};
