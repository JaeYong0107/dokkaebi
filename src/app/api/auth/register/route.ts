import { NextResponse } from "next/server";
import { registerUser, AuthError } from "@/features/auth/auth-service";
import { signupSchema } from "@/features/auth/schemas";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const user = await registerUser(parsed.data);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: { message: error.message, code: error.code } },
        { status: 409 }
      );
    }
    console.error("회원가입 실패:", error);
    return NextResponse.json(
      { error: { message: "회원가입 처리 중 오류가 발생했습니다" } },
      { status: 500 }
    );
  }
}
