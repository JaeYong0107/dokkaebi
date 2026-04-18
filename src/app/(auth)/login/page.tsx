import Link from "next/link";
import { Icon } from "@/components/common/Icon";

export default function LoginPage() {
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

      <form className="space-y-4 rounded-3xl bg-surface-container-lowest p-6 shadow-lift">
        <Field label="이메일" type="email" placeholder="you@dokkaebi.kr" />
        <Field label="비밀번호" type="password" placeholder="••••••••" />
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
          className="w-full rounded-xl bg-gradient-to-br from-primary to-primary-container py-4 font-bold text-white shadow-lg hover:opacity-90"
        >
          로그인
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-on-surface-variant">
        <span className="h-px flex-1 bg-surface-container-highest" />
        간편 로그인
        <span className="h-px flex-1 bg-surface-container-highest" />
      </div>

      <div className="grid grid-cols-3 gap-3">
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

function Field({
  label,
  type,
  placeholder
}: {
  label: string;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-on-surface-variant">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl bg-surface-container-highest px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}

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
      className={`flex flex-col items-center gap-1 rounded-2xl py-3 text-xs font-semibold transition-transform hover:-translate-y-0.5 ${tone}`}
    >
      <Icon name={icon} />
      {label}
    </button>
  );
}
