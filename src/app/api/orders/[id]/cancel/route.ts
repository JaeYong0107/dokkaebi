import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cancelOrder } from "@/features/payment/payment-service";
import { PaymentError } from "@/features/payment/types";
import { ORDER_INCLUDE, toOrderRecord } from "@/server/mappers/order";

const cancelSchema = z.object({
  reason: z.string().min(1, "취소 사유를 입력해주세요").max(200)
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { message: "로그인이 필요합니다" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = cancelSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await cancelOrder({
      orderId: id,
      actor: "CUSTOMER",
      userId: session.user.id,
      reason: parsed.data.reason
    });
  } catch (err) {
    if (err instanceof PaymentError) {
      const status =
        err.code === "FORBIDDEN"
          ? 403
          : err.code === "ORDER_NOT_FOUND"
            ? 404
            : err.code === "NOT_CANCELLABLE"
              ? 409
              : 400;
      return NextResponse.json(
        { message: err.message, code: err.code },
        { status }
      );
    }
    throw err;
  }

  const refreshed = await prisma.order.findUnique({
    where: { id },
    include: ORDER_INCLUDE
  });
  return NextResponse.json(refreshed ? toOrderRecord(refreshed) : null);
}
