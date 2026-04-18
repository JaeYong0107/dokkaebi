import { NextResponse } from "next/server";
import { mockCartItems } from "@/shared/lib/data/cart";

export async function GET() {
  return NextResponse.json({
    customerType: "BUSINESS",
    items: mockCartItems
  });
}
