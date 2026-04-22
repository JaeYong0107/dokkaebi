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

  const [pendingBusiness, lowStock] = await Promise.all([
    prisma.user.count({
      where: { customerType: "BUSINESS", businessApproved: false }
    }),
    prisma.product.count({
      where: { isActive: true, stockQuantity: { lte: 10 } }
    })
  ]);

  return NextResponse.json({
    pendingBusiness,
    lowStock,
    total: pendingBusiness + lowStock
  });
}
