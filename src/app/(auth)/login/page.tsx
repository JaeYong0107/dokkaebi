"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { PasswordField } from "@/components/shell/PasswordField";
import { Icon } from "@/shared/ui/Icon";
import type { LoginInput } from "@/features/auth/schemas";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({ defaultValues: { email: "", password: "" } });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false
    });
    if (!result || result.error) {
      setFormError("이메일 또는 비밀번호가 올바르지 않습니다");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  });

  return (
    <>
      <header className="text-center">
        <h1 className="font-headline text-3xl font-black tracking-tight">
          다시 오셨어요
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          로그인하고 사업자 전용 가격을 확인하세요
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-3xl bg-surface-container-lowest p-6 shadow-lift"
      >
        <Field
          label="이메일"
          type="email"
          placeholder="you@dokkaebi.kr"
          error={errors.email?.message}
          {...register("email", { required: "이메일을 입력하세요" })}
        />
        <PasswordField
          label="비밀번호"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password", { required: "비밀번호를 입력하세요" })}
        />

        {formError && (
          <p className="rounded-xl bg-error/10 px-4 py-3 text-xs font-semibold text-error">
            {formError}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-on-surface-variant">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            로그인 상태 유지
          </label>
          <Link href="#" className="font-semibold text-primary hover:underline">
            비밀번호 찾기
          </Link>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gradient-to-br from-primary to-primary-container py-4 font-bold text-white shadow-lg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-on-surface-variant">
        <span className="h-px flex-1 bg-surface-container-highest" />
        간편 로그인 (준비 중)
        <span className="h-px flex-1 bg-surface-container-highest" />
      </div>

      <div className="grid grid-cols-3 gap-3 opacity-50">
        <SocialBtn label="카카오" icon="chat_bubble" tone="bg-yellow-300 text-stone-800" />
        <SocialBtn label="네이버" icon="circle" tone="bg-green-500 text-white" />
        <SocialBtn label="Google" icon="public" tone="bg-white border border-outline-variant" />
      </div>

      <p className="text-center text-sm text-on-surface-variant">
        아직 회원이 아니신가요?{" "}
        <Link href="/signup" className="font-bold text-primary hover:underline">
          회원가입
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-3xl bg-surface-container-lowest p-6 text-center text-sm text-on-surface-variant shadow-lift">
          로그인 화면을 불러오는 중...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
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

function SocialBtn({
  label,
  icon,
  tone
}: {
  label: string;
  icon: string;
  tone: string;
}) {
  return (
    <button
      type="button"
      disabled
      className={`flex cursor-not-allowed flex-col items-center gap-1 rounded-2xl py-3 text-xs font-semibold ${tone}`}
    >
      <Icon name={icon} />
      {label}
    </button>
  );
}
