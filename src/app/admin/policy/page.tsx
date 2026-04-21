import { getPolicyValues } from "@/features/policy/policy-service";
import { AdminPolicyForm } from "@/widgets/admin-policy/AdminPolicyForm";

export default async function AdminPolicyPage() {
  const initial = await getPolicyValues();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-2xl font-bold">정책 관리</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          배송비·최소 주문 금액 같은 정책값을 DB 기반으로 관리합니다.
          저장 즉시 결제 검증과 배송비 계산에 반영됩니다.
        </p>
      </header>

      <AdminPolicyForm initial={initial} />
    </div>
  );
}
