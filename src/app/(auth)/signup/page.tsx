import Link from "next/link";

export default function SignupPage() {
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

      <form className="space-y-5 rounded-3xl bg-surface-container-lowest p-6 shadow-lift">
        <div>
          <span className="mb-2 block text-xs font-bold text-on-surface-variant">
            회원 유형
          </span>
          <div className="grid grid-cols-2 gap-3">
            <label className="cursor-pointer">
              <input type="radio" name="type" defaultChecked className="peer sr-only" />
              <div className="rounded-2xl border-2 border-outline-variant bg-white p-4 text-center peer-checked:border-primary peer-checked:bg-primary/5">
                <p className="text-2xl">🏠</p>
                <p className="mt-2 text-sm font-bold">일반 고객</p>
                <p className="text-xs text-on-surface-variant">소량 구매</p>
              </div>
            </label>
            <label className="cursor-pointer">
              <input type="radio" name="type" className="peer sr-only" />
              <div className="rounded-2xl border-2 border-outline-variant bg-white p-4 text-center peer-checked:border-primary peer-checked:bg-primary/5">
                <p className="text-2xl">🍳</p>
                <p className="mt-2 text-sm font-bold">사업자</p>
                <p className="text-xs text-on-surface-variant">도매 가격</p>
              </div>
            </label>
          </div>
        </div>

        <Field label="이메일" type="email" placeholder="you@dokkaebi.kr" />
        <Field label="이름 (또는 상호명)" placeholder="두두 한식당" />
        <Field label="휴대폰 번호" type="tel" placeholder="010-1234-5678" />
        <Field label="비밀번호" type="password" placeholder="8자 이상" />
        <Field
          label="비밀번호 확인"
          type="password"
          placeholder="다시 한 번 입력"
        />

        <div className="rounded-2xl bg-surface-container-low p-4 text-xs text-on-surface-variant">
          <label className="flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span>
              <strong className="text-on-surface">이용약관</strong> 및{" "}
              <strong className="text-on-surface">개인정보처리방침</strong>에 동의합니다.
              사업자의 경우 사업자등록번호 인증이 별도 진행됩니다.
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-br from-primary to-primary-container py-4 font-bold text-white shadow-lg hover:opacity-90"
        >
          회원가입 완료
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

function Field({
  label,
  type = "text",
  placeholder
}: {
  label: string;
  type?: string;
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
