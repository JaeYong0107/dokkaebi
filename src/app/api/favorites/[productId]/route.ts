import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

export async function POST(_req: Request, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { message: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const { productId } = await params;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, isActive: true }
  });
  if (!product || !product.isActive) {
    return NextResponse.json(
      { message: "판매 중인 상품이 아닙니다." },
      { status: 404 }
    );
  }

  await prisma.favorite.upsert({
    where: {
      userId_productId: { userId: session.user.id, productId }
    },
    update: {},
    create: { userId: session.user.id, productId }
  });

  return NextResponse.json({ productId, favorited: true });
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { message: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const { productId } = await params;
  await prisma.favorite
    .delete({
      where: {
        userId_productId: { userId: session.user.id, productId }
      }
    })
    .catch(() => null);

  return NextResponse.json({ productId, favorited: false });
}
