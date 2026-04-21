import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("유효한 이메일을 입력하세요"),
  password: z.string().min(1, "비밀번호를 입력하세요")
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    email: z.string().email("유효한 이메일을 입력하세요"),
    password: z.string().min(8, "비밀번호는 8자 이상"),
    confirmPassword: z.string(),
    name: z.string().min(1, "이름을 입력하세요").max(50),
    phone: z.string().optional(),
    customerType: z.enum(["NORMAL", "BUSINESS"]),
    businessName: z.string().optional(),
    businessNumber: z.string().optional(),
    agreedToTerms: z.boolean().refine((v) => v === true, {
      message: "약관에 동의해야 가입할 수 있습니다"
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "비밀번호가 일치하지 않습니다"
  })
  .refine(
    (data) =>
      data.customerType === "NORMAL" ||
      (Boolean(data.businessName) && Boolean(data.businessNumber)),
    {
      path: ["businessNumber"],
      message: "사업자 회원은 상호와 사업자등록번호가 필요합니다"
    }
  );

export type SignupInput = z.infer<typeof signupSchema>;
