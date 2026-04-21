import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/features/product/schemas";
import { toProduct } from "@/server/mappers/product";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "관리자 권한이 필요합니다" },
      { status: 403 }
    );
  }

  const rows = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }]
  });

  const items = rows.map(toProduct);
  return NextResponse.json({ items, total: items.length });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "관리자 권한이 필요합니다" },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.product.findUnique({
    where: { id: parsed.data.id }
  });
  if (existing) {
    return NextResponse.json(
      { message: "이미 존재하는 상품 ID 입니다" },
      { status: 409 }
    );
  }

  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId }
  });
  if (!category) {
    return NextResponse.json(
      { message: "카테고리를 찾을 수 없습니다" },
      { status: 400 }
    );
  }

  const created = await prisma.product.create({
    data: {
      ...parsed.data,
      sku: parsed.data.sku ?? null,
      imageUrl: parsed.data.imageUrl ?? null,
      imageEmoji: parsed.data.imageEmoji ?? null,
      imageBg: parsed.data.imageBg ?? null
    },
    include: { category: true }
  });
  return NextResponse.json(toProduct(created), { status: 201 });
}
