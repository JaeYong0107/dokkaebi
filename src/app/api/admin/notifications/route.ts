import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "관리자 권한이 필요합니다" },
      { status: 403 }
    );
  }

  const [pendingBusiness, lowStockRows] = await Promise.all([
    prisma.user.count({
      where: { customerType: "BUSINESS", businessApproved: false }
    }),
    prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint AS count
      FROM "Product"
      WHERE "isActive" = true
      AND "stockQuantity" <= "lowStockThreshold"
    `
  ]);

  const lowStock = Number(lowStockRows[0]?.count ?? 0);

  return NextResponse.json({
    pendingBusiness,
    lowStock,
    total: pendingBusiness + lowStock
  });
}
