import type { CartInputItem } from "@/features/cart/types";
import type { CustomerType } from "@/features/pricing/types";

export type PaymentMethod =
  | "easy"
  | "card"
  | "transfer"
  | "phone"
  | "naver"
  | "deposit";

export type PaymentProviderName = "mock" | "portone" | "toss";

export type CheckoutRequest = {
  items: CartInputItem[];
  customerType: CustomerType;
  paymentMethod: PaymentMethod;
  recipient: string;
  recipientPhone?: string;
  shippingAddress: string;
  shippingMemo?: string;
  taxInvoiceRequested?: boolean;
};

export type PaymentApproval = {
  provider: PaymentProviderName;
  paymentTxId: string;
  approvedAt: Date;
};

export type PaymentCancelResult = {
  provider: PaymentProviderName;
  cancelTxId: string;
  cancelledAt: Date;
};

export class PaymentError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = "PaymentError";
  }
}
