import { NextResponse } from "next/server";
import { createLocalOrder, listLocalOrders } from "@/server/local-orders";

export async function GET() {
  const items = await listLocalOrders();

  return NextResponse.json({
    items,
    total: items.length
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Parameters<typeof createLocalOrder>[0];
  const order = await createLocalOrder(body);

  return NextResponse.json(order, { status: 201 });
}
