import type { ReactNode } from "react";
import Link from "next/link";
import { getServerOrigin } from "@/shared/lib/api/server-origin";
import { Logo } from "@/shared/ui/Logo";
import { Icon } from "@/shared/ui/Icon";

const NAV = [
  { href: "/admin", icon: "dashboard", label: "대시보드" },
  { href: "/admin/orders", icon: "receipt_long", label: "주문 관리" },
  { href: "/admin/products", icon: "inventory_2", label: "상품 관리" },
  { href: "/admin/users", icon: "group", label: "사용자 관리" },
  { href: "/admin/policy", icon: "tune", label: "정책 관리" }
];

type AdminProfileResponse = {
  adminProfile: {
    email: string;
    initial: string;
    subtitle: string;
    description: string;
  };
};

export default async function AdminLayout({
  children
}: {
  children: ReactNode;
}) {
  const origin = await getServerOrigin();
  const response = await fetch(`${origin}/api/admin/dashboard`, {
    cache: "no-store"
  });
  const data = (await response.json()) as AdminProfileResponse;

  return (
    <div className="flex min-h-screen bg-surface-container-low">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-none border-r border-surface-container bg-surface-container-lowest p-6 md:block">
        <Logo className="mb-8 text-xl" href="/admin" />
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-12 rounded-2xl bg-primary/5 p-4">
          <p className="text-xs font-bold text-primary">
            {data.adminProfile.subtitle}
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">
            {data.adminProfile.description}
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-surface-container bg-surface-container-lowest px-6 py-4 md:px-10">
          <div className="flex items-center gap-3 md:hidden">
            <Logo className="text-lg" href="/admin" />
          </div>
          <div className="hidden md:block">
            <p className="text-xs text-on-surface-variant">2026.04.18 (금)</p>
            <h1 className="font-headline text-xl font-bold">관리자 콘솔</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-full p-2 hover:bg-surface-container-low">
              <Icon name="notifications" className="text-on-surface" />
            </button>
            <div className="flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {data.adminProfile.initial}
              </span>
              <span className="text-sm font-semibold">
                {data.adminProfile.email}
              </span>
            </div>
          </div>
        </header>
        <main className="px-6 py-8 md:px-10">{children}</main>
      </div>
    </div>
  );
}
