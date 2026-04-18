import { NextResponse } from "next/server";
import { siteContent } from "@/shared/lib/data/site-content";

export async function GET() {
  return NextResponse.json(siteContent);
}
