import { NextResponse } from "next/server";
import { buildReorderItems } from "@/features/reorder/reorder-service";
import { mockRecentOrderItems } from "@/features/reorder/mock-data";
import { sampleProducts } from "@/features/product/mock-data";

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
