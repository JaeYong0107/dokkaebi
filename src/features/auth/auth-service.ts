import { prisma } from "@/lib/prisma";
import { hashPassword } from "./password";
import type { SignupInput } from "./schemas";

export async function registerUser(input: SignupInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email }
  });
  if (existing) {
    throw new AuthError("이미 가입된 이메일입니다", "EMAIL_TAKEN");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
      phone: input.phone || null,
      customerType: input.customerType,
      businessName: input.businessName || null,
      businessNumber: input.businessNumber || null,
      businessApproved: false
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      customerType: true,
      businessApproved: true
    }
  });

  return user;
}

export class AuthError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = "AuthError";
  }
}
