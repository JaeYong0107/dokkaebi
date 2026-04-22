import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_INCLUDE, toOrderRecord } from "@/server/mappers/order";

const EDITABLE_STATUSES = new Set(["PENDING", "PAID", "PREPARING"]);

const updateShippingSchema = z.object({
  recipient: z.string().min(1, "수취인을 입력해 주세요").max(50),
  recipientPhone: z.string().max(40).optional().nullable(),
  shippingAddress: z.string().min(1, "배송지를 입력해 주세요").max(200),
  shippingMemo: z.string().max(200).optional().nullable()
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { message: "로그인이 필요합니다" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const row = await prisma.order.findUnique({
    where: { id },
    include: ORDER_INCLUDE
  });

  if (!row) {
    return NextResponse.json(
      { message: "주문을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const isOwner = row.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json(
      { message: "접근 권한이 없습니다" },
      { status: 403 }
    );
  }

  return NextResponse.json(toOrderRecord(row));
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { message: "로그인이 필요합니다" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateShippingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { message: "주문을 찾을 수 없습니다" },
      { status: 404 }
    );
  }

  const isOwner = existing.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json(
      { message: "접근 권한이 없습니다" },
      { status: 403 }
    );
  }

  if (!EDITABLE_STATUSES.has(existing.orderStatus)) {
    return NextResponse.json(
      {
        message:
          "이미 출고되었거나 완료된 주문의 배송지는 변경할 수 없습니다"
      },
      { status: 409 }
    );
  }

  const updated = await prisma.order.update({
    where: { id },
    data: {
      recipient: parsed.data.recipient,
      recipientPhone: parsed.data.recipientPhone ?? null,
      shippingAddress: parsed.data.shippingAddress,
      shippingMemo: parsed.data.shippingMemo ?? null
    },
    include: ORDER_INCLUDE
  });

  return NextResponse.json(toOrderRecord(updated));
}
