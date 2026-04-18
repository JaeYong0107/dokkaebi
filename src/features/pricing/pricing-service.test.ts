import { describe, expect, it } from "vitest";
import { sampleProducts } from "@/mocks/products";
import {
  calculateShippingFee,
  getUnitPrice,
  validateMinimumOrder
} from "./pricing-service";

describe("pricing-service", () => {
  it("returns a business price for business customers", () => {
    const price = getUnitPrice(sampleProducts[0], "BUSINESS");

    expect(price).toBe(sampleProducts[0].priceBusiness);
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
