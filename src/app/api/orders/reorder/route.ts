import { NextResponse } from "next/server";
import { buildReorderItems } from "@/features/reorder/reorder-service";
import { mockRecentOrderItems } from "@/mocks/reorder";
import { sampleProducts } from "@/mocks/products";

export async function POST() {
  const reorderItems = buildReorderItems({
    recentOrderItems: mockRecentOrderItems,
    products: sampleProducts
  });

  return NextResponse.json({
    items: reorderItems,
    total: reorderItems.length
  });
}
