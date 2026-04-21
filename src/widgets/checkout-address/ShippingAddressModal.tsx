"use client";

import { useEffect, useState } from "react";
import type { ShippingAddress } from "@/store/checkout-store";
import { Icon } from "@/shared/ui/Icon";

type Props = {
  initial: ShippingAddress;
  onClose: () => void;
  onSave: (next: ShippingAddress) => void;
};

export function ShippingAddressModal({
  initial,
  onClose,
  onSave
}: Readonly<Props>) {
  const [form, setForm] = useState<ShippingAddress>(initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const update = <K extends keyof ShippingAddress>(key: K, value: ShippingAddress[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.recipient.trim()) {
      setError("받는 분 이름을 입력해 주세요");
      return;
    }
    if (!form.address.trim()) {
      setError("주소를 입력해 주세요");
      return;
    }
    onSave({
      recipient: form.recipient.trim(),
      recipientPhone: form.recipientPhone.trim(),
      address: form.address.trim(),
      addressDetail: form.addressDetail.trim()
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-surface-container-lowest p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="배송지 변경"
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high"
        >
          <Icon name="close" />
        </button>
        <h2 className="mb-6 font-headline text-xl font-bold">배송지 변경</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="받는 분">
            <input
              type="text"
              value={form.recipient}
              onChange={(e) => update("recipient", e.target.value)}
              required
              autoFocus
              className={inputClass}
            />
          </Field>
          <Field label="연락처">
            <input
              type="tel"
              value={form.recipientPhone}
              onChange={(e) => update("recipientPhone", e.target.value)}
              placeholder="010-0000-0000"
              className={inputClass}
            />
          </Field>
          <Field label="주소">
            <input
              type="text"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="서울특별시 강남구 테헤란로 427"
              required
              className={inputClass}
            />
          </Field>
          <Field label="상세 주소 (선택)">
            <input
              type="text"
              value={form.addressDetail}
              onChange={(e) => update("addressDetail", e.target.value)}
              placeholder="15층 1501호"
              className={inputClass}
            />
          </Field>

          {error && (
            <p className="rounded-xl bg-error/10 px-4 py-3 text-xs font-semibold text-error">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-surface-container bg-surface-container-low px-3 py-2 text-sm outline-none focus:border-primary";

function Field({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}
