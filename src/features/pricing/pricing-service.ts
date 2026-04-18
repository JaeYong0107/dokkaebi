import type { Product } from "@/features/product/types";
import type { CustomerType } from "./types";

export function getOriginalPrice(product: Product) {
  return product.basePrice;
}

export function getDiscountRate(product: Product, customerType: CustomerType) {
  return customerType === "BUSINESS"
    ? product.businessDiscountRate
    : product.normalDiscountRate;
}

export function getUnitPrice(product: Product, customerType: CustomerType) {
  const discountRate = getDiscountRate(product, customerType);
  return Math.round(product.basePrice * ((100 - discountRate) / 100));
}

export function getDiscountAmount(product: Product, customerType: CustomerType) {
  return getOriginalPrice(product) - getUnitPrice(product, customerType);
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
