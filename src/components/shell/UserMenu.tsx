"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Icon } from "@/shared/ui/Icon";

type Props = {
  variant?: "shop" | "admin";
};

export function UserMenu({ variant = "shop" }: Readonly<Props>) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (status === "loading") {
    return (
      <div className="h-9 w-20 animate-pulse rounded-full bg-surface-container-high" />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className={
          variant === "admin"
            ? "rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-on-primary"
            : "rounded-full bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:opacity-90"
        }
      >
        로그인
      </Link>
    );
  }

  const user = session.user;
  const initial = (user.name ?? user.email ?? "?").slice(0, 1).toUpperCase();

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full bg-surface-container-low px-2.5 py-1.5 text-sm font-semibold text-on-surface hover:bg-surface-container"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
          {initial}
        </span>
        <span className="hidden max-w-[120px] truncate md:inline">
          {user.name ?? user.email}
        </span>
        <Icon name="arrow_drop_down" className="text-base" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] w-56 overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-panel"
        >
          <div className="border-b border-outline-variant/30 px-4 py-3">
            <p className="truncate text-sm font-bold text-on-surface">
              {user.name ?? "이름 없음"}
            </p>
            <p className="truncate text-xs text-on-surface-variant">
              {user.email}
            </p>
            <div className="mt-2 flex gap-1">
              <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-bold text-on-surface-variant">
                {user.customerType === "BUSINESS" ? "사업자" : "일반 고객"}
              </span>
              {user.role === "ADMIN" && (
                <span className="rounded-full bg-primary-container px-2 py-0.5 text-[10px] font-bold text-on-primary-container">
                  관리자
                </span>
              )}
              {user.customerType === "BUSINESS" && user.businessApproved && (
                <span className="rounded-full bg-tertiary-container px-2 py-0.5 text-[10px] font-bold text-on-tertiary-container">
                  승인됨
                </span>
              )}
            </div>
          </div>

          <nav className="py-1 text-sm">
            {variant === "admin" && (
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-on-surface hover:bg-surface-container-low"
              >
                <Icon name="storefront" className="text-base" />
                쇼핑몰 보기
              </Link>
            )}
            <Link
              href="/mypage"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-on-surface hover:bg-surface-container-low"
            >
              <Icon name="person" className="text-base" />
              마이페이지
            </Link>
            <Link
              href="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-on-surface hover:bg-surface-container-low"
            >
              <Icon name="receipt_long" className="text-base" />
              주문 내역
            </Link>
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-on-surface hover:bg-surface-container-low"
              >
                <Icon name="dashboard" className="text-base" />
                관리자 콘솔
              </Link>
            )}
          </nav>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              void signOut({ callbackUrl: "/" });
            }}
            className="flex w-full items-center gap-2 border-t border-outline-variant/30 px-4 py-3 text-left text-sm font-bold text-error hover:bg-error/5"
          >
            <Icon name="logout" className="text-base" />
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
