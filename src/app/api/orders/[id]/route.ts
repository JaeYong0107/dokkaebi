import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_INCLUDE, toOrderRecord } from "@/server/mappers/order";

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
