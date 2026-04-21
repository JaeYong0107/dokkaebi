import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toProduct } from "@/server/mappers/product";

export async function GET() {
  const rows = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ isActive: "desc" }, { createdAt: "asc" }]
  });
  const items = rows.map(toProduct);
  return NextResponse.json({ items, total: items.length });
}
