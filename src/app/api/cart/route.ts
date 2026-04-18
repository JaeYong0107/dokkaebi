import { NextResponse } from "next/server";
import { buildCartSummary } from "@/features/cart/cart-service";
import { mockCartItems } from "@/mocks/cart";
import { sampleProducts } from "@/mocks/products";

export async function GET() {
  const summary = buildCartSummary({
    customerType: "NORMAL",
    items: mockCartItems,
    products: sampleProducts
  });

  return NextResponse.json(summary);
}
