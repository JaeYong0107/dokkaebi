import type { CustomerType } from "@/features/pricing/types";
import { prisma } from "@/lib/prisma";
import { getPolicyValues } from "@/features/policy/policy-service";
import { getPaymentProvider } from "./provider";
import type { CheckoutRequest } from "./types";
import { PaymentError } from "./types";

function unitPriceFor(
  product: { basePrice: number; normalDiscountRate: number; businessDiscountRate: number },
  customerType: CustomerType
) {
  const rate =
    customerType === "BUSINESS"
      ? product.businessDiscountRate
      : product.normalDiscountRate;
  return Math.round(product.basePrice * ((100 - rate) / 100));
}

type CheckoutResult = {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  paymentTxId: string;
};

function generateOrderNumber(now: Date): string {
  const stamp = now
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(0, 14); // YYYYMMDDhhmmss
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `DK-${stamp}-${rand}`;
}

function getMinimum(
  customerType: CustomerType,
  policy: Awaited<ReturnType<typeof getPolicyValues>>
) {
  return customerType === "BUSINESS"
    ? policy.minOrderBusiness
    : policy.minOrderNormal;
}

export async function checkoutAndPay(
  userId: string,
  request: CheckoutRequest
): Promise<CheckoutResult> {
  const products = await prisma.product.findMany({
    where: { id: { in: request.items.map((i) => i.productId) } }
  });
  const productById = new Map(products.map((p) => [p.id, p]));

  for (const item of request.items) {
    const product = productById.get(item.productId);
    if (!product) {
      throw new PaymentError(
        `상품을 찾을 수 없습니다: ${item.productId}`,
        "PRODUCT_NOT_FOUND"
      );
    }
    if (!product.isActive) {
      throw new PaymentError(
        `판매 중지된 상품입니다: ${product.name}`,
        "PRODUCT_INACTIVE"
      );
    }
    if (product.stockQuantity < item.quantity) {
      throw new PaymentError(
        `재고가 부족합니다: ${product.name} (남은 수량 ${product.stockQuantity})`,
        "OUT_OF_STOCK"
      );
    }
  }

  const lineItems = request.items.map((item) => {
    const product = productById.get(item.productId)!;
    const unitPrice = unitPriceFor(product, request.customerType);
    return {
      productId: product.id,
      productNameSnapshot: product.name,
      unitPrice,
      quantity: item.quantity,
      lineTotal: unitPrice * item.quantity
    };
  });

  const subtotal = lineItems.reduce((sum, l) => sum + l.lineTotal, 0);
  const policy = await getPolicyValues();
  const shippingFee =
    request.customerType === "BUSINESS" || subtotal >= policy.freeShippingThreshold
      ? 0
      : policy.defaultShippingFee;
  const totalAmount = subtotal + shippingFee;

  const minimum = getMinimum(request.customerType, policy);
  if (subtotal < minimum) {
    throw new PaymentError(
      `최소 주문 금액 미달 (필요: ${minimum.toLocaleString("ko-KR")}원)`,
      "BELOW_MINIMUM_ORDER"
    );
  }

  const now = new Date();
  const orderNumber = generateOrderNumber(now);
  const provider = getPaymentProvider();
  const approval = await provider.approve({
    orderNumber,
    amount: totalAmount,
    paymentMethod: request.paymentMethod
  });

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        orderNumber,
        customerTypeSnapshot: request.customerType,
        subtotalAmount: subtotal,
        shippingFee,
        totalAmount,
        paymentStatus: "PAID",
        orderStatus: "PAID",
        paymentMethod: request.paymentMethod,
        paymentProvider: approval.provider,
        paymentTxId: approval.paymentTxId,
        shippingAddress: request.shippingAddress,
        recipient: request.recipient,
        recipientPhone: request.recipientPhone ?? null,
        shippingMemo: request.shippingMemo ?? null,
        taxInvoiceRequested: request.taxInvoiceRequested ?? false,
        orderedAt: now,
        items: { create: lineItems },
        delivery: { create: { deliveryStatus: "PENDING" } }
      }
    });

    for (const line of lineItems) {
      await tx.product.update({
        where: { id: line.productId },
        data: { stockQuantity: { decrement: line.quantity } }
      });
    }

    const cart = await tx.cart.findUnique({ where: { userId } });
    if (cart) {
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return created;
  });

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    totalAmount: order.totalAmount,
    paymentTxId: approval.paymentTxId
  };
}

type CancelActor = "CUSTOMER" | "ADMIN";

type CancelOrderInput = {
  orderId: string;
  actor: CancelActor;
  /** 호출자가 본인 주문인지 확인할 때 사용. ADMIN 이면 undefined 가능. */
  userId?: string;
  reason: string;
};

// 소비자가 스스로 취소할 수 있는 상태. 이후 단계는 고객센터 문의로 안내.
const CUSTOMER_CANCELLABLE_STATUSES = new Set(["PENDING", "PAID"]);
// 관리자는 이미 취소됐거나 배송 완료된 것만 아니면 강제 취소 가능.
const ADMIN_NON_CANCELLABLE_STATUSES = new Set(["CANCELLED", "DELIVERED"]);

export async function cancelOrder(input: CancelOrderInput) {
  const { orderId, actor, userId, reason } = input;
  const trimmedReason = reason.trim();
  if (!trimmedReason) {
    throw new PaymentError("취소 사유를 입력해주세요", "REASON_REQUIRED");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });
  if (!order) {
    throw new PaymentError("주문을 찾을 수 없습니다", "ORDER_NOT_FOUND");
  }
  if (actor === "CUSTOMER") {
    if (order.userId !== userId) {
      throw new PaymentError("본인 주문만 취소할 수 있습니다", "FORBIDDEN");
    }
    if (!CUSTOMER_CANCELLABLE_STATUSES.has(order.orderStatus)) {
      throw new PaymentError(
        "현재 상태에서는 직접 취소가 어렵습니다. 고객센터로 문의해 주세요.",
        "NOT_CANCELLABLE"
      );
    }
  } else {
    if (ADMIN_NON_CANCELLABLE_STATUSES.has(order.orderStatus)) {
      throw new PaymentError(
        "이미 취소되었거나 배송 완료된 주문입니다",
        "NOT_CANCELLABLE"
      );
    }
  }

  // 결제 완료 건이면 PG 환불 호출 (mock).
  if (order.paymentStatus === "PAID" && order.paymentTxId) {
    const provider = getPaymentProvider();
    await provider.cancel({
      orderNumber: order.orderNumber,
      paymentTxId: order.paymentTxId,
      amount: order.totalAmount,
      reason: trimmedReason
    });
  }

  const now = new Date();
  const cancelledBy =
    actor === "ADMIN" ? "ADMIN" : userId ? `USER:${userId}` : "USER";

  await prisma.$transaction(async (tx) => {
    // 재고 복구 — 결제/배송이 진행 중이라 이미 차감된 수량을 되돌림.
    for (const line of order.items) {
      await tx.product.update({
        where: { id: line.productId },
        data: { stockQuantity: { increment: line.quantity } }
      });
    }

    await tx.order.update({
      where: { id: order.id },
      data: {
        orderStatus: "CANCELLED",
        paymentStatus:
          order.paymentStatus === "PAID" ? "CANCELLED" : order.paymentStatus,
        cancelledAt: now,
        cancellationReason: trimmedReason,
        cancelledBy
      }
    });

    if (order.orderStatus !== "CANCELLED") {
      await tx.delivery
        .update({
          where: { orderId: order.id },
          data: { deliveryStatus: "CANCELLED" }
        })
        .catch(() => null);
    }
  });

  return { orderId: order.id, orderStatus: "CANCELLED" as const };
}
