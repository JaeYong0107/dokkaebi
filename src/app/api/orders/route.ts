import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_INCLUDE, toOrderRecord } from "@/server/mappers/order";

export async function GET() {
  const session = await auth();
  // 홈 등 공개 페이지에서도 호출되므로 비로그인은 빈 배열로 응답한다.
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
