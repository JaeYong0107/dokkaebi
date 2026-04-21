"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  customerType: "NORMAL" | "BUSINESS";
  businessName: string;
  businessNumber: string;
  agreedToTerms: boolean;
};

export default function SignupPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
      customerType: "NORMAL",
      businessName: "",
      businessNumber: "",
      agreedToTerms: false
    }
  });

  const customerType = watch("customerType");
  const password = watch("password");

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setFormError(
        body?.error?.message ??
          "회원가입에 실패했습니다. 입력값을 확인해주세요."
      );
      return;
    }

    const signInResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false
    });
    if (!signInResult || signInResult.error) {
      router.push("/login");
      return;
    }
    router.push("/");
    router.refresh();
  });

  return (
    <>
      <header className="text-center">
        <h1 className="font-headline text-3xl font-black tracking-tight">
          dokkaebi 가입하기
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          가정용/사업자용 모두 같은 계정으로 사용할 수 있어요
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-3xl bg-surface-container-lowest p-6 shadow-lift"
      >
        <div>
          <span className="mb-2 block text-xs font-bold text-on-surface-variant">
            회원 유형
          </span>
          <div className="grid grid-cols-2 gap-3">
            <label className="cursor-pointer">
              <input
                type="radio"
                value="NORMAL"
                {...register("customerType")}
                className="peer sr-only"
              />
              <div className="rounded-2xl border-2 border-outline-variant bg-white p-4 text-center peer-checked:border-primary peer-checked:bg-primary/5">
                <p className="text-2xl">🏠</p>
                <p className="mt-2 text-sm font-bold">일반 고객</p>
                <p className="text-xs text-on-surface-variant">소량 구매</p>
              </div>
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                value="BUSINESS"
                {...register("customerType")}
                className="peer sr-only"
              />
              <div className="rounded-2xl border-2 border-outline-variant bg-white p-4 text-center peer-checked:border-primary peer-checked:bg-primary/5">
                <p className="text-2xl">🍳</p>
                <p className="mt-2 text-sm font-bold">사업자</p>
                <p className="text-xs text-on-surface-variant">도매 가격</p>
              </div>
            </label>
          </div>
        </div>

        <Field
          label="이메일"
          type="email"
          placeholder="you@dokkaebi.kr"
          error={errors.email?.message}
          {...register("email", {
            required: "이메일을 입력하세요",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "유효한 이메일 형식이 아닙니다"
            }
          })}
        />
        <Field
          label={customerType === "BUSINESS" ? "담당자 이름" : "이름"}
          placeholder="홍길동"
          error={errors.name?.message}
          {...register("name", { required: "이름을 입력하세요" })}
        />
        {customerType === "BUSINESS" && (
          <>
            <Field
              label="상호명"
              placeholder="두두 한식당"
              error={errors.businessName?.message}
              {...register("businessName", {
                required: "사업자 회원은 상호명이 필요합니다"
              })}
            />
            <Field
              label="사업자등록번호"
              placeholder="000-00-00000"
              error={errors.businessNumber?.message}
              {...register("businessNumber", {
                required: "사업자 회원은 사업자등록번호가 필요합니다"
              })}
            />
          </>
        )}
        <Field
          label="휴대폰 번호"
          type="tel"
          placeholder="010-1234-5678"
          {...register("phone")}
        />
        <Field
          label="비밀번호"
          type="password"
          placeholder="8자 이상"
          error={errors.password?.message}
          {...register("password", {
            required: "비밀번호를 입력하세요",
            minLength: { value: 8, message: "비밀번호는 8자 이상이어야 합니다" }
          })}
        />
        <Field
          label="비밀번호 확인"
          type="password"
          placeholder="다시 한 번 입력"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", {
            required: "비밀번호 확인을 입력하세요",
            validate: (v) => v === password || "비밀번호가 일치하지 않습니다"
          })}
        />

        <div className="rounded-2xl bg-surface-container-low p-4 text-xs text-on-surface-variant">
          <label className="flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              {...register("agreedToTerms", {
                required: "약관에 동의해야 가입할 수 있습니다"
              })}
              className="mt-0.5 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span>
              <strong className="text-on-surface">이용약관</strong> 및{" "}
              <strong className="text-on-surface">개인정보처리방침</strong>에 동의합니다.
              사업자의 경우 사업자등록번호 인증이 별도 진행됩니다.
            </span>
          </label>
          {errors.agreedToTerms && (
            <span className="mt-2 block text-[11px] font-semibold text-error">
              {errors.agreedToTerms.message}
            </span>
          )}
        </div>

        {formError && (
          <p className="rounded-xl bg-error/10 px-4 py-3 text-xs font-semibold text-error">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gradient-to-br from-primary to-primary-container py-4 font-bold text-white shadow-lg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "가입 처리 중..." : "회원가입 완료"}
        </button>
      </form>

      <p className="text-center text-sm text-on-surface-variant">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          로그인
        </Link>
      </p>
    </>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const Field = function Field(props: FieldProps) {
  const { label, error, ...rest } = props;
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-on-surface-variant">
        {label}
      </span>
      <input
        {...rest}
        className="w-full rounded-xl bg-surface-container-highest px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
      {error && (
        <span className="mt-1 block text-[11px] font-semibold text-error">
          {error}
        </span>
      )}
    </label>
  );
};
