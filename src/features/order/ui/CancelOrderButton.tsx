"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ApiError, apiFetch } from "@/shared/lib/api/api-fetch";
import { Icon } from "@/shared/ui/Icon";
import type { OrderStatus } from "../types";

const CANCELLABLE_STATUSES: OrderStatus[] = ["PENDING", "PAID"];

type Variant = "primary" | "ghost" | "small";

type Props = {
  orderId: string;
  orderStatus: OrderStatus;
  variant?: Variant;
  label?: string;
  onCancelled?: () => void;
};

const BASE_VARIANTS: Record<Variant, string> = {
  primary:
    "flex-1 rounded-xl border border-error/40 bg-white px-4 py-2 text-center text-sm font-bold text-error hover:border-error hover:bg-error/5 md:flex-none",
  ghost:
    "rounded-xl border border-outline-variant px-4 py-2 text-sm font-bold text-on-surface-variant hover:border-error hover:text-error",
  small:
    "rounded-full border border-error/30 px-3 py-1 text-xs font-bold text-error hover:bg-error/10"
};

const PRESET_REASONS = [
  "단순 변심",
  "주문 정보 오입력",
  "결제 수단 변경",
  "배송 일정 변경 필요",
  "기타"
];

export function CancelOrderButton({
  orderId,
  orderStatus,
  variant = "primary",
  label = "주문 취소",
  onCancelled
}: Readonly<Props>) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(PRESET_REASONS[0]);
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) setOpen(false);
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, submitting]);

  if (!CANCELLABLE_STATUSES.includes(orderStatus)) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reason = selected === "기타" ? detail.trim() : selected;
    if (!reason) {
      setError("취소 사유를 입력해주세요");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await apiFetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        body: JSON.stringify({ reason })
      });
      setOpen(false);
      startTransition(() => router.refresh());
      onCancelled?.();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("취소 요청 중 오류가 발생했습니다");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={BASE_VARIANTS[variant]}
      >
        {label}
      </button>
      {open && (
        <div
          role="presentation"
          onClick={() => !submitting && setOpen(false)}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4"
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-order-title"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-3xl bg-surface-container-lowest p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
                <Icon name="cancel" className="text-xl text-error" />
              </div>
              <div>
                <h2
                  id="cancel-order-title"
                  className="font-headline text-lg font-black text-on-surface"
                >
                  주문을 취소할까요?
                </h2>
                <p className="text-xs text-on-surface-variant">
                  결제 완료 건은 취소 시 환불 처리되고, 재고도 복구됩니다.
                </p>
              </div>
            </div>

            <fieldset className="mb-4 space-y-2">
              <legend className="mb-2 text-xs font-bold text-on-surface-variant">
                취소 사유
              </legend>
              {PRESET_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={
                    selected === reason
                      ? "flex cursor-pointer items-center gap-2 rounded-xl border border-primary bg-primary/5 px-3 py-2 text-sm font-semibold text-on-surface"
                      : "flex cursor-pointer items-center gap-2 rounded-xl border border-outline-variant px-3 py-2 text-sm font-medium text-on-surface hover:border-primary"
                  }
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selected === reason}
                    onChange={() => {
                      setSelected(reason);
                      setError(null);
                    }}
                    className="h-4 w-4 accent-primary"
                  />
                  {reason}
                </label>
              ))}
            </fieldset>

            {selected === "기타" && (
              <label className="mb-4 block">
                <span className="mb-1 block text-xs font-bold text-on-surface-variant">
                  상세 사유 (필수)
                </span>
                <textarea
                  value={detail}
                  onChange={(e) => {
                    setDetail(e.target.value);
                    setError(null);
                  }}
                  maxLength={200}
                  rows={3}
                  className="w-full rounded-xl border border-outline-variant px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="취소 이유를 입력해 주세요"
                />
              </label>
            )}

            {error && (
              <p className="mb-3 rounded-xl bg-error/10 px-3 py-2 text-xs font-semibold text-error">
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={submitting}
                className="rounded-full border border-outline-variant px-5 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40"
              >
                닫기
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center rounded-full bg-error px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "취소 중..." : "주문 취소"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
