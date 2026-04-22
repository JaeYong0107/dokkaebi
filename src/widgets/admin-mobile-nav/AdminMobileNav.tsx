"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/shared/ui/Icon";

type NavItem = {
  href: string;
  icon: string;
  label: string;
};

type Props = {
  items: readonly NavItem[];
};

export function AdminMobileNav({ items }: Readonly<Props>) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    // body 스크롤 잠금
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open]);

  // 라우트 변경 시 자동 닫힘
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="관리자 메뉴 열기"
        className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low md:hidden"
      >
        <Icon name="menu" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="관리자 내비게이션"
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-y-0 left-0 w-72 max-w-[80vw] overflow-y-auto bg-surface-container-lowest p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-headline text-lg font-black text-primary">
                관리자 메뉴
              </span>
              <button
                type="button"
                aria-label="닫기"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high"
              >
                <Icon name="close" />
              </button>
            </div>
            <nav className="space-y-1">
              {items.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      isActive
                        ? "flex items-center gap-3 rounded-xl bg-primary-container px-3 py-2.5 text-sm font-semibold text-on-primary-container"
                        : "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    }
                  >
                    <Icon name={item.icon} filled={isActive} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/"
              className="mt-6 flex items-center gap-2 rounded-xl border border-surface-container px-3 py-2.5 text-sm font-bold text-on-surface-variant hover:border-primary hover:text-primary"
            >
              <Icon name="storefront" className="text-base" />
              쇼핑몰로 이동
            </Link>
          </aside>
        </div>
      )}
    </>
  );
}
