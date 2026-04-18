import { NextResponse } from "next/server";
import { buildCartSummary } from "@/features/cart/cart-service";
import { mockCartItems } from "@/features/cart/mock-data";
import { sampleProducts } from "@/features/product/mock-data";

export async function GET() {
  const summary = buildCartSummary({
    customerType: "NORMAL",
    items: mockCartItems,
    products: sampleProducts
  });

  return NextResponse.json(summary);
}
