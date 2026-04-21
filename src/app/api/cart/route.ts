import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const cartSyncSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive()
      })
    )
    .max(100)
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ customerType: "NORMAL", items: [] });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { cart: { include: { items: true } } }
  });

  const items = (user?.cart?.items ?? []).map((it) => ({
    productId: it.productId,
    quantity: it.quantity
  }));

  return NextResponse.json({
    customerType: user?.customerType ?? "NORMAL",
    items
  });
}

// 로컬 장바구니(Zustand localStorage)를 로그인 후 서버 Cart 로 동기화할 때 사용.
export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { message: "로그인이 필요합니다" },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = cartSyncSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { items } = parsed.data;

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
    select: { id: true, basePrice: true }
  });
  const priceById = new Map(products.map((p) => [p.id, p.basePrice]));

  await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id }
    });
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    if (items.length > 0) {
      await tx.cartItem.createMany({
        data: items
          .filter((it) => priceById.has(it.productId))
          .map((it) => ({
            cartId: cart.id,
            productId: it.productId,
            quantity: it.quantity,
            unitPriceSnapshot: priceById.get(it.productId) ?? 0
          }))
      });
    }
  });

  return NextResponse.json({ ok: true });
}
