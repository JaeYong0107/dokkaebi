import type { ReactNode } from "react";
import { TopAppBar } from "@/components/shell/TopAppBar";
import { BottomNav } from "@/components/shell/BottomNav";
import { SiteFooter } from "@/components/shell/SiteFooter";

export default function ShopLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      <TopAppBar />
      <div className="pb-24 pt-24 md:pb-0">{children}</div>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
