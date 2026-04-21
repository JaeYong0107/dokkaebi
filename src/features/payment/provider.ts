import type { PaymentApproval, PaymentProviderName } from "./types";
import { PaymentError } from "./types";

type ApproveInput = {
  orderNumber: string;
  amount: number;
  paymentMethod: string;
};

export interface PaymentProvider {
  name: PaymentProviderName;
  approve(input: ApproveInput): Promise<PaymentApproval>;
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
