import { NextResponse } from "next/server";
import { sampleProducts } from "@/features/product/mock-data";

export async function GET() {
  return NextResponse.json({
    items: sampleProducts,
    total: sampleProducts.length
  });
}
