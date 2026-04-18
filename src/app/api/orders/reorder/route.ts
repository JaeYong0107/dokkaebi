import { NextResponse } from "next/server";
import { buildReorderItems } from "@/features/reorder/reorder-service";
import { sampleProducts } from "@/shared/lib/data/products";
import { listLocalOrders } from "@/server/local-orders";

export async function POST() {
  const orders = await listLocalOrders();
  const latestOrder = orders[0];

  if (!latestOrder) {
    return NextResponse.json({
      items: [],
      total: 0
    });
  }

  const reorderItems = buildReorderItems({
    recentOrderItems: latestOrder.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity
    })),
    products: sampleProducts
  });

  return NextResponse.json({
    items: reorderItems,
    total: reorderItems.length
  });
}
