"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Icon } from "@/shared/ui/Icon";

type Props = {
  label: string;
};

type FormState = {
  name: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

const EMPTY: FormState = {
  name: "",
  phone: "",
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: ""
};

export function EditProfileButton({ label }: Readonly<Props>) {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
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

  const openModal = () => {
    setForm({
      name: session?.user?.name ?? "",
      phone: "",
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: ""
    });
    setMessage(null);
    setOpen(true);
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    const wantsPasswordChange = form.newPassword.length > 0;
    if (wantsPasswordChange) {
      if (form.newPassword !== form.newPasswordConfirm) {
        setMessage({ tone: "error", text: "새 비밀번호가 일치하지 않습니다" });
        return;
      }
      if (form.newPassword.length < 8) {
        setMessage({ tone: "error", text: "새 비밀번호는 8자 이상이어야 합니다" });
        return;
      }
      if (!form.currentPassword) {
        setMessage({ tone: "error", text: "현재 비밀번호를 입력해 주세요" });
        return;
      }
    }

    const payload: Record<string, string> = {};
    if (form.name.trim() && form.name !== session?.user?.name) {
      payload.name = form.name.trim();
    }
    if (form.phone.trim()) {
      payload.phone = form.phone.trim();
    }
    if (wantsPasswordChange) {
      payload.currentPassword = form.currentPassword;
      payload.newPassword = form.newPassword;
    }

    if (Object.keys(payload).length === 0) {
      setMessage({ tone: "error", text: "변경할 내용이 없습니다" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
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
      setMessage({ tone: "success", text: "회원정보가 수정되었습니다" });
      // NextAuth 세션도 갱신
      await updateSession?.();
      router.refresh();
      setTimeout(() => setOpen(false), 800);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
      >
        {label}
        <Icon name="arrow_forward_ios" className="text-xs" />
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
            aria-label="회원정보 수정"
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
            <h2 className="mb-2 font-headline text-xl font-bold">회원정보 수정</h2>
            <p className="mb-6 text-xs text-on-surface-variant">
              비밀번호는 변경할 때만 입력하세요.
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              <Field label="이름">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="휴대폰 번호">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="010-0000-0000"
                  className={inputClass}
                />
              </Field>

              <div className="border-t border-outline-variant/30 pt-4">
                <p className="mb-3 text-xs font-bold text-on-surface-variant">
                  비밀번호 변경 (선택)
                </p>
                <div className="space-y-3">
                  <Field label="현재 비밀번호">
                    <input
                      type="password"
                      value={form.currentPassword}
                      onChange={(e) => update("currentPassword", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="새 비밀번호 (8자 이상)">
                    <input
                      type="password"
                      value={form.newPassword}
                      onChange={(e) => update("newPassword", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="새 비밀번호 확인">
                    <input
                      type="password"
                      value={form.newPasswordConfirm}
                      onChange={(e) =>
                        update("newPasswordConfirm", e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>
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
                  disabled={saving}
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary disabled:opacity-50"
                >
                  {saving ? "저장 중..." : "저장"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

const inputClass =
  "w-full rounded-xl border border-surface-container bg-surface-container-low px-3 py-2 text-sm outline-none focus:border-primary";

function Field({
  label,
  children
}: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}
