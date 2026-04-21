import type { CustomerType } from "@/features/pricing/types";
import { prisma } from "@/lib/prisma";
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

function getPolicy() {
  const defaultShippingFee = Number(process.env.DEFAULT_SHIPPING_FEE ?? 3000);
  const freeShippingThreshold = Number(
    process.env.FREE_SHIPPING_THRESHOLD ?? 50000
  );
  const minOrderNormal = Number(process.env.MIN_ORDER_NORMAL ?? 10000);
  const minOrderBusiness = Number(process.env.MIN_ORDER_BUSINESS ?? 50000);
  return {
    defaultShippingFee,
    freeShippingThreshold,
    minOrderNormal,
    minOrderBusiness
  };
}

function getMinimum(customerType: CustomerType) {
  const { minOrderNormal, minOrderBusiness } = getPolicy();
  return customerType === "BUSINESS" ? minOrderBusiness : minOrderNormal;
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
  const { defaultShippingFee, freeShippingThreshold } = getPolicy();
  const shippingFee =
    request.customerType === "BUSINESS" || subtotal >= freeShippingThreshold
      ? 0
      : defaultShippingFee;
  const totalAmount = subtotal + shippingFee;

  const minimum = getMinimum(request.customerType);
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
