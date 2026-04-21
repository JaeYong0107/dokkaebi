"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Icon } from "@/shared/ui/Icon";

type Props = {
  label: string;
};

export function BusinessApplyButton({ label }: Readonly<Props>) {
  const { update: updateSession } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<
    { tone: "success" | "error"; text: string } | null
  >(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const reset = () => {
    setBusinessName("");
    setBusinessNumber("");
    setMessage(null);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!businessName.trim() || !businessNumber.trim()) {
      setMessage({ tone: "error", text: "상호와 사업자등록번호를 모두 입력해 주세요" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applyBusiness: {
            businessName: businessName.trim(),
            businessNumber: businessNumber.trim()
          }
        })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setMessage({
          tone: "error",
          text: body?.message ?? "신청에 실패했습니다"
        });
        return;
      }
      setMessage({
        tone: "success",
        text: "사업자 인증 신청이 접수되었습니다. 관리자 승인 후 도매가가 적용됩니다."
      });
      await updateSession?.();
      router.refresh();
      setTimeout(() => {
        setOpen(false);
        reset();
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-primary px-8 py-3 font-bold text-white transition-all hover:bg-primary-container active:scale-95"
      >
        {label}
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
            aria-label="사업자 인증 신청"
            className="relative w-full max-w-md rounded-2xl bg-surface-container-lowest p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="닫기"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high"
            >
              <Icon name="close" />
            </button>
            <h2 className="mb-2 font-headline text-xl font-bold text-on-surface">
              사업자 인증 신청
            </h2>
            <p className="mb-6 text-xs text-on-surface-variant">
              관리자 승인 완료 후 도매가·무료 배송 등 사업자 혜택이 적용됩니다.
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-on-surface-variant">
                  상호
                </span>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="두두 한식당"
                  required
                  autoFocus
                  className="w-full rounded-xl border border-surface-container bg-surface-container-low px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-on-surface-variant">
                  사업자등록번호
                </span>
                <input
                  type="text"
                  value={businessNumber}
                  onChange={(e) => setBusinessNumber(e.target.value)}
                  placeholder="000-00-00000"
                  required
                  className="w-full rounded-xl border border-surface-container bg-surface-container-low px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </label>

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

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary disabled:opacity-50"
                >
                  {submitting ? "신청 중..." : "신청하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
