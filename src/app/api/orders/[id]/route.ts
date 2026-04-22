import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_INCLUDE, toOrderRecord } from "@/server/mappers/order";

const EDITABLE_SHIPPING_STATUSES = new Set(["PENDING", "PAID", "PREPARING"]);

const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PREPARING",
  "SHIPPING",
  "DELIVERED",
  "CANCELLED"
] as const;

const updateOrderSchema = z
  .object({
    recipient: z.string().min(1).max(50).optional(),
    recipientPhone: z.string().max(40).optional().nullable(),
    shippingAddress: z.string().min(1).max(200).optional(),
    shippingMemo: z.string().max(200).optional().nullable(),
    orderStatus: z.enum(ORDER_STATUSES).optional()
  })
  .refine(
    (data) =>
      data.recipient !== undefined ||
      data.recipientPhone !== undefined ||
      data.shippingAddress !== undefined ||
      data.shippingMemo !== undefined ||
      data.orderStatus !== undefined,
    { message: "변경할 항목이 하나 이상 필요합니다" }
  );

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
  const parsed = updateOrderSchema.safeParse(body);
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

  const { orderStatus, ...shippingFields } = parsed.data;

  // 주문 상태 전환은 ADMIN 만
  if (orderStatus !== undefined && !isAdmin) {
    return NextResponse.json(
      { message: "주문 상태 변경은 관리자만 가능합니다" },
      { status: 403 }
    );
  }

  // 배송 정보 변경은 배송 전 상태만 (ADMIN 도 동일 정책)
  const wantsShippingChange = Object.keys(shippingFields).some(
    (key) =>
      shippingFields[key as keyof typeof shippingFields] !== undefined
  );
  if (
    wantsShippingChange &&
    !EDITABLE_SHIPPING_STATUSES.has(existing.orderStatus)
  ) {
    return NextResponse.json(
      {
        message:
          "이미 출고되었거나 완료된 주문의 배송지는 변경할 수 없습니다"
      },
      { status: 409 }
    );
  }

  const data: Parameters<typeof prisma.order.update>[0]["data"] = {};
  if (shippingFields.recipient !== undefined) {
    data.recipient = shippingFields.recipient;
  }
  if (shippingFields.recipientPhone !== undefined) {
    data.recipientPhone = shippingFields.recipientPhone ?? null;
  }
  if (shippingFields.shippingAddress !== undefined) {
    data.shippingAddress = shippingFields.shippingAddress;
  }
  if (shippingFields.shippingMemo !== undefined) {
    data.shippingMemo = shippingFields.shippingMemo ?? null;
  }
  if (orderStatus !== undefined) {
    data.orderStatus = orderStatus;
  }

  const updated = await prisma.order.update({
    where: { id },
    data,
    include: ORDER_INCLUDE
  });

  return NextResponse.json(toOrderRecord(updated));
}
