import { NextResponse } from "next/server";
import { getLocalOrderById } from "@/server/local-orders";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
  const order = await getLocalOrderById(id);

  if (!order) {
    return NextResponse.json(
      { message: "주문을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json(order);
}
