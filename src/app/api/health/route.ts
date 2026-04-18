import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "service_project",
    timestamp: new Date().toISOString()
  });
}
