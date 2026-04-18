import { NextResponse } from "next/server";
import { sampleProducts } from "@/shared/lib/data/products";

export async function GET() {
  return NextResponse.json({
    items: sampleProducts,
    total: sampleProducts.length
  });
}
