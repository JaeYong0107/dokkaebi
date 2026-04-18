import { NextResponse } from "next/server";
import { getProductById } from "@/shared/lib/data/products";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return NextResponse.json(
      { message: "상품을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}
