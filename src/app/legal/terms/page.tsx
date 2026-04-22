export const metadata = {
  title: "이용약관 | dokkaebi"
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-6 font-headline text-3xl font-black tracking-tight">
        이용약관
      </h1>
      <p className="mb-6 text-sm text-on-surface-variant">
        본 약관은 (주)도깨비 (이하 &quot;회사&quot;) 가 제공하는 dokkaebi 서비스의
        이용 조건을 규정합니다. 정식 법무 검토 전 임시 초안입니다.
      </p>

      <section className="space-y-4 rounded-2xl bg-surface-container-low p-6 text-sm leading-relaxed text-on-surface-variant">
        <h2 className="text-base font-bold text-on-surface">제1조 (목적)</h2>
        <p>
          이 약관은 회원이 도깨비 서비스에 접속하여 식자재 커머스 서비스를
          이용함에 있어 회사와 회원 간 권리·의무·책임 사항을 규정함을
          목적으로 합니다.
        </p>
        <h2 className="text-base font-bold text-on-surface">제2조 (회원 가입)</h2>
        <p>
          일반 고객과 사업자 회원은 온라인 가입 절차를 통해 서비스를 이용할
          수 있으며, 사업자 회원은 별도 인증 후 도매가·세금계산서 발행
          혜택을 적용받습니다.
        </p>
        <h2 className="text-base font-bold text-on-surface">
          제3조 (주문·결제·배송)
        </h2>
        <p>
          주문·결제·배송에 관한 구체 규정은 별도의 배송 안내와 환불 규정을
          따릅니다.
        </p>
        <p className="mt-6 text-xs text-on-surface-variant/60">
          본 문서는 임시로 작성된 초안으로, 정식 서비스 이전에 법무
          검토를 거쳐 업데이트될 예정입니다.
        </p>
      </section>
    </main>
  );
}
