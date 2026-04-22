"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLoginPromptStore } from "@/shared/store/use-login-prompt-store";
import { Icon } from "@/shared/ui/Icon";

export function LoginPromptModal() {
  const { open, message, dismiss } = useLoginPromptStore();
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, dismiss]);

  if (!open) return null;

  const callbackUrl = pathname ?? "/";
  const loginHref = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <div
      role="presentation"
      onClick={dismiss}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-prompt-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-surface-container-lowest p-6 shadow-2xl"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-container">
          <Icon name="lock" className="text-2xl text-on-primary-container" />
        </div>
        <h2
          id="login-prompt-title"
          className="mb-2 font-headline text-xl font-black text-on-surface"
        >
          로그인이 필요해요
        </h2>
        <p className="mb-6 text-sm text-on-surface-variant">
          {message ?? "로그인이 필요한 기능입니다."}
        </p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full border border-outline-variant px-5 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low"
          >
            닫기
          </button>
          <Link
            href={loginHref}
            onClick={dismiss}
            className="flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-on-primary hover:opacity-90"
          >
            로그인 하러가기
          </Link>
        </div>
      </div>
    </div>
  );
}
