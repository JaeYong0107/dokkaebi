import { getPolicyConfig } from "@/shared/lib/config";
import type { Product } from "@/features/product/types";
import {
  calculateShippingFee,
  getUnitPrice,
  validateMinimumOrder
} from "@/features/pricing/pricing-service";
import type { CustomerType } from "@/features/pricing/types";
import type { CartInputItem } from "./types";

export function buildCartSummary(params: {
  customerType: CustomerType;
  items: CartInputItem[];
  products: Product[];
}) {
  const lines = params.items.flatMap((item) => {
    const product = params.products.find(
      (candidate) => candidate.id === item.productId && candidate.isActive
    );

    if (!product) {
      return [];
    }

    const unitPrice = getUnitPrice(product, params.customerType);
    const lineTotal = unitPrice * item.quantity;

    return [
      {
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        unitPrice,
        lineTotal
      }
    ];
  });

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const shippingFee = calculateShippingFee({
    customerType: params.customerType,
    subtotal,
    freeShippingThreshold: getPolicyConfig("FREE_SHIPPING_THRESHOLD"),
    defaultShippingFee: getPolicyConfig("DEFAULT_SHIPPING_FEE")
  });
  const minimumOrder = validateMinimumOrder({
    customerType: params.customerType,
    subtotal,
    normalMinimum: getPolicyConfig("MIN_ORDER_NORMAL"),
    businessMinimum: getPolicyConfig("MIN_ORDER_BUSINESS")
  });

  return {
    customerType: params.customerType,
    items: lines,
    subtotal,
    shippingFee,
    totalAmount: subtotal + shippingFee,
    minimumOrder
  };
}
