import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toAdminUser } from "@/server/mappers/user";

const updateSchema = z.object({
  businessApproved: z.boolean().optional(),
  role: z.enum(["CUSTOMER", "ADMIN"]).optional()
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "관리자 권한이 필요합니다" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (session.user.id === id && parsed.data.role === "CUSTOMER") {
    return NextResponse.json(
      { message: "본인 계정의 관리자 권한은 내릴 수 없습니다" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { message: "사용자를 찾을 수 없습니다" },
      { status: 404 }
    );
  }

  if (
    parsed.data.businessApproved !== undefined &&
    existing.customerType !== "BUSINESS"
  ) {
    return NextResponse.json(
      { message: "사업자 회원이 아닙니다" },
      { status: 409 }
    );
  }

  const updated = await prisma.user.update({
    where: { id },
    data: parsed.data,
    include: { _count: { select: { orders: true } } }
  });

  return NextResponse.json(toAdminUser(updated, updated._count.orders));
}
