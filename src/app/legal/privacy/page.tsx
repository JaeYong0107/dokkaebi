export const metadata = {
  title: "개인정보처리방침 | dokkaebi"
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-6 font-headline text-3xl font-black tracking-tight">
        개인정보처리방침
      </h1>
      <p className="mb-6 text-sm text-on-surface-variant">
        (주)도깨비는 회원의 개인정보를 소중히 다루며, 개인정보보호법 등
        관련 법령을 준수합니다. 정식 법무 검토 전 임시 초안입니다.
      </p>

      <section className="space-y-4 rounded-2xl bg-surface-container-low p-6 text-sm leading-relaxed text-on-surface-variant">
        <h2 className="text-base font-bold text-on-surface">1. 수집 항목</h2>
        <p>
          이메일, 이름, 휴대폰 번호, 비밀번호(해시 저장), 배송지, 주문 내역,
          사업자 회원의 경우 상호·사업자등록번호.
        </p>
        <h2 className="text-base font-bold text-on-surface">2. 이용 목적</h2>
        <p>
          회원 식별·인증, 주문 처리 및 배송, 고객 문의 응대, 사업자 승인
          관리, 관련 법령에 따른 의무 이행.
        </p>
        <h2 className="text-base font-bold text-on-surface">3. 보관 기간</h2>
        <p>
          회원 탈퇴 시 지체 없이 파기하며, 관련 법령에 따른 보관 의무가
          있는 경우 해당 기간 동안 별도 보관 후 파기합니다.
        </p>
        <h2 className="text-base font-bold text-on-surface">4. 제3자 제공</h2>
        <p>
          이용자의 사전 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
          결제 시 PG사(향후 연동), 배송사(택배) 에 필요 최소한만 위탁합니다.
        </p>
        <p className="mt-6 text-xs text-on-surface-variant/60">
          본 문서는 임시 초안으로, 정식 운영 전 법무 검토 후 업데이트될
          예정입니다. 관련 문의는 <a href="mailto:support@dokkaebi.kr" className="underline hover:text-primary">support@dokkaebi.kr</a>.
        </p>
      </section>
    </main>
  );
}
