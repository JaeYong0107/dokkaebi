import type { ReactNode } from "react";
import { CartSeedBootstrap } from "@/components/cart/CartSeedBootstrap";
import { BottomNav } from "@/widgets/bottom-nav/BottomNav";
import { SiteFooter } from "@/widgets/site-footer/SiteFooter";
import { TopAppBar } from "@/widgets/top-app-bar/TopAppBar";

export default function ShopLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased">
      <CartSeedBootstrap />
      <TopAppBar />
      <div className="pb-24 pt-24 md:pb-0">{children}</div>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
