import { describe, expect, it } from "vitest";
import type { Product } from "@/features/product/types";
import {
  calculateShippingFee,
  getDiscountRate,
  getUnitPrice,
  validateMinimumOrder
} from "./pricing-service";

const testProduct: Product = {
  id: "prod-test-lettuce",
  sku: "TEST-001",
  name: "테스트 레터스",
  description: "단위 테스트 전용 고정 상품",
  category: "채소",
  unit: "1kg / 봉",
  basePrice: 18500,
  normalDiscountRate: 0,
  businessDiscountRate: 22,
  origin: "테스트 산지",
  imageEmoji: "🥬",
  imageBg: "from-emerald-200 to-emerald-400",
  isActive: true,
  stockQuantity: 42
};

describe("pricing-service", () => {
  it("returns a discount-applied business price for business customers", () => {
    const price = getUnitPrice(testProduct, "BUSINESS");

    expect(price).toBe(14430);
  });

  it("returns the configured discount rate by customer type", () => {
    expect(getDiscountRate(testProduct, "NORMAL")).toBe(
      testProduct.normalDiscountRate
    );
    expect(getDiscountRate(testProduct, "BUSINESS")).toBe(
      testProduct.businessDiscountRate
    );
  });

  it("gives business customers free shipping", () => {
    const shippingFee = calculateShippingFee({
      customerType: "BUSINESS",
      subtotal: 1000,
      freeShippingThreshold: 50000,
      defaultShippingFee: 3000
    });

    expect(shippingFee).toBe(0);
  });

  it("validates normal minimum order correctly", () => {
    const result = validateMinimumOrder({
      customerType: "NORMAL",
      subtotal: 9000,
      normalMinimum: 10000,
      businessMinimum: 50000
    });

    expect(result.isSatisfied).toBe(false);
    expect(result.minimum).toBe(10000);
  });
});
