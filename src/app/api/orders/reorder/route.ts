import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildReorderItems } from "@/features/reorder/reorder-service";
import { toProduct } from "@/server/mappers/product";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { message: "로그인이 필요합니다" },
      { status: 401 }
    );
  }

  const latestOrder = await prisma.order.findFirst({
    where: { userId: session.user.id },
    orderBy: { orderedAt: "desc" },
    include: { items: true }
  });

  if (!latestOrder) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const productRows = await prisma.product.findMany({
    include: { category: true }
  });
  const products = productRows.map(toProduct);

  const reorderItems = buildReorderItems({
    recentOrderItems: latestOrder.items.map((it) => ({
      productId: it.productId,
      quantity: it.quantity
    })),
    products
  });

  return NextResponse.json({
    items: reorderItems,
    total: reorderItems.length
  });
}
