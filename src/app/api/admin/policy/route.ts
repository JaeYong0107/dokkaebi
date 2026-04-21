import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import {
  getPolicyValues,
  upsertPolicyValues
} from "@/features/policy/policy-service";

const policySchema = z.object({
  defaultShippingFee: z.number().int().min(0).optional(),
  freeShippingThreshold: z.number().int().min(0).optional(),
  minOrderNormal: z.number().int().min(0).optional(),
  minOrderBusiness: z.number().int().min(0).optional()
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "관리자 권한이 필요합니다" },
      { status: 403 }
    );
  }
  return null;
}

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;
  const values = await getPolicyValues();
  return NextResponse.json(values);
}

export async function PUT(request: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const body = await request.json().catch(() => null);
  const parsed = policySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updated = await upsertPolicyValues(parsed.data);
  return NextResponse.json(updated);
}
