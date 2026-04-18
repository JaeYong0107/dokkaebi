import type { Product } from "@/features/product/types";
import type { CustomerType } from "./types";

export function getUnitPrice(product: Product, customerType: CustomerType) {
  return customerType === "BUSINESS"
    ? product.priceBusiness
    : product.priceNormal;
}

export function calculateShippingFee(params: {
  customerType: CustomerType;
  subtotal: number;
  freeShippingThreshold: number;
  defaultShippingFee: number;
}) {
  const {
    customerType,
    subtotal,
    freeShippingThreshold,
    defaultShippingFee
  } = params;

  if (customerType === "BUSINESS") {
    return 0;
  }

  if (subtotal >= freeShippingThreshold) {
    return 0;
  }

  return defaultShippingFee;
}

export function validateMinimumOrder(params: {
  customerType: CustomerType;
  subtotal: number;
  normalMinimum: number;
  businessMinimum: number;
}) {
  const { customerType, subtotal, normalMinimum, businessMinimum } = params;
  const minimum = customerType === "BUSINESS" ? businessMinimum : normalMinimum;

  return {
    minimum,
    isSatisfied: subtotal >= minimum
  };
}
