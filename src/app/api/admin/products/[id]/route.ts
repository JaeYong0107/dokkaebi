import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateProductSchema } from "@/features/product/schemas";
import { toProduct } from "@/server/mappers/product";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "관리자 권한이 필요합니다" },
      { status: 403 }
    );
  }
  return null;
}

export async function GET(_: Request, { params }: RouteContext) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { id } = await params;
  const row = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });
  if (!row) {
    return NextResponse.json(
      { message: "상품을 찾을 수 없습니다" },
      { status: 404 }
    );
  }
  return NextResponse.json(toProduct(row));
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (parsed.data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: parsed.data.categoryId }
    });
    if (!category) {
      return NextResponse.json(
        { message: "카테고리를 찾을 수 없습니다" },
        { status: 400 }
      );
    }
  }

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: parsed.data,
      include: { category: true }
    });
    return NextResponse.json(toProduct(updated));
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { message: "상품을 찾을 수 없습니다" },
        { status: 404 }
      );
    }
    throw error;
  }
}
