import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { checkoutAndPay } from "@/features/payment/payment-service";
import { checkoutRequestSchema } from "@/features/payment/schemas";
import { PaymentError } from "@/features/payment/types";
import { ORDER_INCLUDE, toOrderRecord } from "@/server/mappers/order";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const rows = await prisma.order.findMany({
    where:
      session.user.role === "ADMIN"
        ? undefined
        : { userId: session.user.id },
    include: ORDER_INCLUDE,
    orderBy: { orderedAt: "desc" }
  });

  const items = rows.map(toOrderRecord);
  return NextResponse.json({ items, total: items.length });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { message: "로그인이 필요합니다" },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await checkoutAndPay(session.user.id, parsed.data);
    const created = await prisma.order.findUnique({
      where: { id: result.orderId },
      include: ORDER_INCLUDE
    });
    if (!created) {
      return NextResponse.json(
        { message: "주문 조회에 실패했습니다" },
        { status: 500 }
      );
    }
    return NextResponse.json(toOrderRecord(created), { status: 201 });
  } catch (error) {
    if (error instanceof PaymentError) {
      const status =
        error.code === "OUT_OF_STOCK" ||
        error.code === "PRODUCT_INACTIVE" ||
        error.code === "BELOW_MINIMUM_ORDER"
          ? 409
          : error.code === "PRODUCT_NOT_FOUND"
            ? 404
            : 400;
      return NextResponse.json(
        { error: { message: error.message, code: error.code } },
        { status }
      );
    }
    console.error("주문 생성 실패:", error);
    return NextResponse.json(
      { error: { message: "주문 생성 중 오류가 발생했습니다" } },
      { status: 500 }
    );
  }
}
