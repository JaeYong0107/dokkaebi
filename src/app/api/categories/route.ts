import { NextResponse } from "next/server";
import { sampleCategories } from "@/shared/lib/data/products";

export async function GET() {
  return NextResponse.json({
    items: sampleCategories,
    total: sampleCategories.length
  });
}
