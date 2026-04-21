import { NextResponse } from "next/server";
import { productDetailContent } from "@/server/content/product-detail-content";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;
  const override =
    productDetailContent.overrides[
      id as keyof typeof productDetailContent.overrides
    ] ?? productDetailContent.overrides.default;

  return NextResponse.json({
    ...productDetailContent.common,
    metrics: override.metrics,
    nutrition: override.nutrition
  });
}
