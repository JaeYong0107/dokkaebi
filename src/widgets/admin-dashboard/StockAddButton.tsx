"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/shared/ui/Icon";

type Props = {
  productId: string;
  productName: string;
  stockQuantity: number;
};

export function StockAddButton({
  productId,
  productName,
  stockQuantity
}: Readonly<Props>) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("10");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    inputRef.current?.select();
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const delta = Number.parseInt(amount, 10);
    if (!Number.isFinite(delta) || delta <= 0) {
      setError("1 이상의 숫자를 입력해 주세요");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stockQuantity: stockQuantity + delta })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.message ?? "재고 업데이트에 실패했습니다");
        return;
      }
      setOpen(false);
      setAmount("10");
      startTransition(() => router.refresh());
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={pending}
        aria-label={`${productName} 재고 추가`}
        className="rounded-full p-1 text-primary hover:bg-primary/10 disabled:opacity-40"
      >
        <Icon name="add_box" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="재고 추가"
            className="relative w-full max-w-sm rounded-2xl bg-surface-container-lowest p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="닫기"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high"
            >
              <Icon name="close" className="text-base" />
            </button>
            <h2 className="mb-1 text-base font-bold text-on-surface">
              재고 추가
            </h2>
            <p className="mb-4 text-xs text-on-surface-variant">
              {productName} · 현재 {stockQuantity}
            </p>
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-on-surface-variant">
                  추가할 수량
                </span>
                <input
                  ref={inputRef}
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-surface-container bg-surface-container-low px-3 py-2 text-right text-sm outline-none focus:border-primary"
                />
              </label>
              {error && (
                <p className="rounded-xl bg-error/10 px-3 py-2 text-xs font-semibold text-error">
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary disabled:opacity-50"
                >
                  {saving ? "저장 중..." : `+${amount} 저장`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
