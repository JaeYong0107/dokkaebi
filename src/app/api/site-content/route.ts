import { NextResponse } from "next/server";
import { siteContent } from "@/server/content/site-content";

export async function GET() {
  return NextResponse.json(siteContent);
}
