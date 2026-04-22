import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { toProduct } from "@/server/mappers/product";

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

type RouteContext = {
  params: Promise<{ id: string }>;
};

const DEFAULT_LIMIT = 4;

/**
 * 특정 상품과 함께 주문된 다른 상품을 카운트 기반으로 추천.
 * 공동구매 기록이 부족하면 같은 카테고리 활성 상품으로 fallback.
 */
export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const url = new URL(request.url);
  const limit = Math.max(
    1,
    Math.min(
      12,
      Number.parseInt(url.searchParams.get("limit") ?? "", 10) || DEFAULT_LIMIT
    )
  );

  const self = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });
  if (!self) {
    return NextResponse.json({ items: [] });
  }

  // 이 상품이 포함된 주문들의 id 모음
  const coOrderItems = await prisma.orderItem.findMany({
    where: { productId: id },
    select: { orderId: true }
  });
  const orderIds = [...new Set(coOrderItems.map((it) => it.orderId))];

  const coOccurrence: Record<string, number> = {};
  if (orderIds.length > 0) {
    const siblings = await prisma.orderItem.findMany({
      where: {
        orderId: { in: orderIds },
        productId: { not: id }
      },
      select: { productId: true, quantity: true }
    });
    for (const it of siblings) {
      coOccurrence[it.productId] =
        (coOccurrence[it.productId] ?? 0) + it.quantity;
    }
  }

  const rankedIds = Object.entries(coOccurrence)
    .sort((a, b) => b[1] - a[1])
    .map(([productId]) => productId);

  const picked: ProductWithCategory[] = [];
  const seen = new Set<string>([id]);

  if (rankedIds.length > 0) {
    const rows = await prisma.product.findMany({
      where: { id: { in: rankedIds }, isActive: true },
      include: { category: true }
    });
    // 랭킹 순서 보존
    const byId = new Map(rows.map((row) => [row.id, row]));
    for (const rid of rankedIds) {
      const row = byId.get(rid);
      if (row && !seen.has(row.id)) {
        picked.push(row);
        seen.add(row.id);
      }
    }
  }

  // fallback 1: 같은 카테고리 활성 상품
  if (picked.length < limit) {
    const fallback = await prisma.product.findMany({
      where: {
        categoryId: self.categoryId,
        isActive: true,
        id: { notIn: [...seen] }
      },
      include: { category: true },
      take: limit - picked.length,
      orderBy: { createdAt: "desc" }
    });
    for (const row of fallback) {
      if (picked.length >= limit) break;
      if (!seen.has(row.id)) {
        picked.push(row);
        seen.add(row.id);
      }
    }
  }

  // fallback 2: 기타 활성 상품 (여전히 부족할 때)
  if (picked.length < limit) {
    const extra = await prisma.product.findMany({
      where: { isActive: true, id: { notIn: [...seen] } },
      include: { category: true },
      take: limit - picked.length,
      orderBy: { createdAt: "desc" }
    });
    for (const row of extra) {
      if (picked.length >= limit) break;
      picked.push(row);
      seen.add(row.id);
    }
  }

  return NextResponse.json({
    items: picked.slice(0, limit).map(toProduct)
  });
}
