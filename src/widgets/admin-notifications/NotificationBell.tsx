"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/ui/Icon";

type NotificationSummary = {
  pendingBusiness: number;
  lowStock: number;
  total: number;
};

export function NotificationBell() {
  const [data, setData] = useState<NotificationSummary | null>(null);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/notifications", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && json) setData(json as NotificationSummary);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const total = data?.total ?? 0;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`알림 ${total}건`}
        aria-expanded={open}
        className="relative rounded-full p-2 hover:bg-surface-container-low"
      >
        <Icon name="notifications" className="text-on-surface" />
        {total > 0 && (
          <span
            aria-hidden
            className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-black text-white"
          >
            {total > 99 ? "99+" : total}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] w-72 overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-panel"
        >
          <div className="border-b border-outline-variant/30 px-4 py-3">
            <p className="text-sm font-bold text-on-surface">알림</p>
            <p className="text-xs text-on-surface-variant">
              처리 대기 중인 항목 {total}건
            </p>
          </div>

          <nav className="divide-y divide-outline-variant/20 text-sm">
            <NotificationItem
              href="/admin/users?approval=PENDING&type=BUSINESS"
              icon="verified_user"
              label="사업자 승인 대기"
              count={data?.pendingBusiness ?? 0}
              emptyText="승인 대기 중인 사업자 회원이 없습니다"
              onClick={() => setOpen(false)}
            />
            <NotificationItem
              href="/admin/products?active=ACTIVE"
              icon="warning"
              label="저재고 상품"
              count={data?.lowStock ?? 0}
              emptyText="재고 부족 상품이 없습니다"
              onClick={() => setOpen(false)}
            />
          </nav>
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  href,
  icon,
  label,
  count,
  emptyText,
  onClick
}: Readonly<{
  href: string;
  icon: string;
  label: string;
  count: number;
  emptyText: string;
  onClick: () => void;
}>) {
  if (count === 0) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 text-xs text-on-surface-variant/70">
        <Icon name={icon} className="text-base text-on-surface-variant/50" />
        <span className="flex-1">{emptyText}</span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low"
    >
      <Icon name={icon} className="text-base text-primary" />
      <span className="flex-1 text-on-surface">{label}</span>
      <span className="rounded-full bg-error px-2 py-0.5 text-[10px] font-bold text-white">
        {count}
      </span>
    </Link>
  );
}
