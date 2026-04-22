import type {
  Delivery as DbDelivery,
  Order as DbOrder,
  OrderItem as DbOrderItem,
  Product as DbProduct,
  User as DbUser
} from "@prisma/client";
import type { OrderRecord, OrderItemSummary } from "@/features/order/types";

export type DbOrderWithIncludes = DbOrder & {
  items: (DbOrderItem & { product: Pick<DbProduct, "imageEmoji" | "imageBg"> })[];
  delivery: DbDelivery | null;
  user: Pick<DbUser, "name" | "businessName">;
};

export function toOrderRecord(db: DbOrderWithIncludes): OrderRecord {
  return {
    id: db.id,
    orderNumber: db.orderNumber,
    orderedAt: db.orderedAt.toISOString().slice(0, 16).replace("T", " "),
    customerType: db.customerTypeSnapshot,
    customerName: db.user.businessName ?? db.user.name,
    items: db.items.map(
      (it): OrderItemSummary => ({
        productId: it.productId,
        productName: it.productNameSnapshot,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        lineTotal: it.lineTotal,
        imageEmoji: it.product.imageEmoji ?? "📦",
        imageBg: it.product.imageBg ?? "from-slate-200 to-slate-400"
      })
    ),
    subtotal: db.subtotalAmount,
    shippingFee: db.shippingFee,
    total: db.totalAmount,
    orderStatus: db.orderStatus,
    paymentStatus: db.paymentStatus,
    shippingAddress: db.shippingAddress,
    recipient: db.recipient || db.user.name,
    trackingNumber: db.delivery?.trackingNumber ?? undefined,
    courierName: db.delivery?.courierName ?? undefined,
    cancelledAt: db.cancelledAt
      ? db.cancelledAt.toISOString().slice(0, 16).replace("T", " ")
      : undefined,
    cancellationReason: db.cancellationReason ?? undefined,
    cancelledBy: db.cancelledBy ?? undefined
  };
}

export const ORDER_INCLUDE = {
  items: {
    include: {
      product: {
        select: { imageEmoji: true, imageBg: true }
      }
    }
  },
  delivery: true,
  user: {
    select: { name: true, businessName: true }
  }
} as const;
