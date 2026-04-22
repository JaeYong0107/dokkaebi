import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toProduct } from "@/server/mappers/product";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { message: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const rows = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "desc" }
  });

  const items = rows
    .filter((row) => row.product.isActive)
    .map((row) => ({
      productId: row.productId,
      createdAt: row.createdAt.toISOString(),
      product: toProduct(row.product)
    }));

  return NextResponse.json({
    items,
    productIds: rows.map((row) => row.productId)
  });
}
