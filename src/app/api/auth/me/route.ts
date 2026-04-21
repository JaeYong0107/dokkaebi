import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/features/auth/password";
import { updateProfileSchema } from "@/features/auth/schemas";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { message: "로그인이 필요합니다" },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, phone, currentPassword, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });
  if (!user) {
    return NextResponse.json(
      { message: "사용자를 찾을 수 없습니다" },
      { status: 404 }
    );
  }

  const updates: {
    name?: string;
    phone?: string | null;
    passwordHash?: string;
  } = {};

  if (name !== undefined) updates.name = name;
  if (phone !== undefined) updates.phone = phone || null;

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json(
        { message: "현재 비밀번호를 입력해 주세요" },
        { status: 400 }
      );
    }
    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { message: "현재 비밀번호가 일치하지 않습니다" },
        { status: 400 }
      );
    }
    updates.passwordHash = await hashPassword(newPassword);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { message: "변경할 항목이 없습니다" },
      { status: 400 }
    );
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: updates,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      customerType: true,
      businessApproved: true
    }
  });

  return NextResponse.json({ user: updated });
}
