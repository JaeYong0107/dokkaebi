"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Icon } from "@/shared/ui/Icon";

const NAV_ITEMS = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/products", label: "카테고리", icon: "grid_view" },
  { href: "/reorder", label: "재주문", icon: "history" },
  { href: "/orders", label: "주문내역", icon: "receipt_long" },
  { href: "/mypage", label: "마이", icon: "person" }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-around rounded-t-3xl border-t border-surface-container bg-surface-container-lowest/95 px-4 pb-7 pt-3 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl md:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex flex-col items-center justify-center rounded-full px-4 py-2 transition-all active:scale-90",
              isActive
                ? "bg-secondary-container/15 text-secondary-container"
                : "text-on-surface-variant"
            )}
          >
            <Icon name={item.icon} filled={isActive} />
            <span className="mt-0.5 font-headline text-[11px] font-semibold">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
