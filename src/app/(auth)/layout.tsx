import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface to-surface-container-low">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <Logo />
        <Link
          href="/"
          className="text-sm font-semibold text-on-surface-variant hover:text-primary"
        >
          홈으로
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 pb-16 pt-6 md:pt-10">
        {children}
      </main>
    </div>
  );
}
