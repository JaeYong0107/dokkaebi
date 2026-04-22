import type {
  PaymentApproval,
  PaymentCancelResult,
  PaymentProviderName
} from "./types";
import { PaymentError } from "./types";

type ApproveInput = {
  orderNumber: string;
  amount: number;
  paymentMethod: string;
};

type CancelInput = {
  orderNumber: string;
  paymentTxId: string;
  amount: number;
  reason: string;
};

export interface PaymentProvider {
  name: PaymentProviderName;
  approve(input: ApproveInput): Promise<PaymentApproval>;
  cancel(input: CancelInput): Promise<PaymentCancelResult>;
}

class MockPaymentProvider implements PaymentProvider {
  name: PaymentProviderName = "mock";

  async approve({ orderNumber, amount }: ApproveInput): Promise<PaymentApproval> {
    if (amount <= 0) {
      throw new PaymentError(
        "결제 금액이 올바르지 않습니다",
        "INVALID_AMOUNT"
      );
    }
    const paymentTxId = `mock-${orderNumber}-${Date.now()}`;
    return {
      provider: "mock",
      paymentTxId,
      approvedAt: new Date()
    };
  }

  async cancel({ orderNumber, paymentTxId, amount }: CancelInput): Promise<PaymentCancelResult> {
    if (!paymentTxId) {
      throw new PaymentError(
        "결제 트랜잭션 정보가 없습니다",
        "MISSING_TX_ID"
      );
    }
    if (amount <= 0) {
      throw new PaymentError(
        "환불 금액이 올바르지 않습니다",
        "INVALID_AMOUNT"
      );
    }
    const cancelTxId = `mock-cancel-${orderNumber}-${Date.now()}`;
    return {
      provider: "mock",
      cancelTxId,
      cancelledAt: new Date()
    };
  }
}

let cached: PaymentProvider | null = null;

export function getPaymentProvider(): PaymentProvider {
  if (cached) return cached;
  const configured = process.env.PAYMENT_PROVIDER ?? "mock";
  if (configured === "mock") {
    cached = new MockPaymentProvider();
    return cached;
  }
  // 실 PG 를 붙일 때 여기에 분기 추가. 지금은 mock 만 지원.
  throw new PaymentError(
    `지원하지 않는 PAYMENT_PROVIDER: ${configured}`,
    "UNSUPPORTED_PROVIDER"
  );
}
