import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toProduct } from "@/server/mappers/product";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
  const row = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });

  if (!row) {
    return NextResponse.json(
      { message: "상품을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json(toProduct(row));
}
