import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toCategory } from "@/server/mappers/product";

// 프론트는 "전체보기" 가상 카테고리를 기대하므로 DB 카테고리 앞에 합성.
const ALL_CATEGORY = {
  id: "all",
  name: "전체보기",
  icon: "grid_view",
  productCategories: [],
  featured: true
} as const;

export async function GET() {
  const rows = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  const items = [ALL_CATEGORY, ...rows.map(toCategory)];
  return NextResponse.json({ items, total: items.length });
}
