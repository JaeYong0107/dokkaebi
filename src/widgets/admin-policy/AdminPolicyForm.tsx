"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Icon } from "@/shared/ui/Icon";
import {
  POLICY_KEYS,
  POLICY_LABELS,
  type PolicyKey,
  type PolicyValues
} from "@/features/policy/types";

type Props = {
  initial: PolicyValues;
};

type FormState = Record<PolicyKey, string>;

function toFormState(values: PolicyValues): FormState {
  return {
    defaultShippingFee: String(values.defaultShippingFee),
    freeShippingThreshold: String(values.freeShippingThreshold),
    minOrderNormal: String(values.minOrderNormal),
    minOrderBusiness: String(values.minOrderBusiness)
  };
}

export function AdminPolicyForm({ initial }: Readonly<Props>) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(() => toFormState(initial));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<
    { tone: "success" | "error"; text: string } | null
  >(null);

  const dirty = POLICY_KEYS.some(
    (key) => form[key] !== String(initial[key])
  );

  const onReset = () => {
    setForm(toFormState(initial));
    setMessage(null);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload: Partial<PolicyValues> = {};
    for (const key of POLICY_KEYS) {
      const n = Number(form[key]);
      if (!Number.isFinite(n) || n < 0) {
        setMessage({
          tone: "error",
          text: `${POLICY_LABELS[key].title} 값이 올바르지 않습니다`
        });
        setSaving(false);
        return;
      }
      payload[key] = n;
    }

    try {
      const res = await fetch("/api/admin/policy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setMessage({
          tone: "error",
          text: body?.message ?? "저장에 실패했습니다"
        });
        return;
      }
      setMessage({ tone: "success", text: "정책값이 저장되었습니다" });
      startTransition(() => router.refresh());
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-2xl border border-surface-container bg-surface-container-lowest p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {POLICY_KEYS.map((key) => (
          <label key={key} className="block">
            <span className="mb-1 block text-sm font-bold text-on-surface">
              {POLICY_LABELS[key].title}
            </span>
            <span className="mb-2 block text-xs text-on-surface-variant">
              {POLICY_LABELS[key].hint}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="100"
                value={form[key]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="flex-1 rounded-xl border border-surface-container bg-surface-container-low px-4 py-2.5 text-right tabular-nums outline-none focus:border-primary"
              />
              <span className="text-sm font-bold text-on-surface-variant">
                원
              </span>
            </div>
            <span className="mt-1 block text-[11px] text-on-surface-variant/70">
              현재값 {initial[key].toLocaleString("ko-KR")}원
            </span>
          </label>
        ))}
      </div>

      {message && (
        <p
          className={
            message.tone === "success"
              ? "rounded-xl bg-primary/10 px-4 py-3 text-xs font-semibold text-primary"
              : "rounded-xl bg-error/10 px-4 py-3 text-xs font-semibold text-error"
          }
        >
          {message.text}
        </p>
      )}

      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-xs text-on-surface-variant">
          <Icon name="info" className="text-base" />
          결제 시점의 최소 주문 검증, 배송비 계산에 즉시 반영됩니다.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onReset}
            disabled={!dirty || saving || pending}
            className="rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high disabled:opacity-40"
          >
            되돌리기
          </button>
          <button
            type="submit"
            disabled={!dirty || saving || pending}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </form>
  );
}
