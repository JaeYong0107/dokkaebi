import Link from "next/link";
import { Icon } from "@/shared/ui/Icon";
import { Logo } from "@/shared/ui/Logo";

export function TopAppBar() {
  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="border-b-2 border-primary py-1 font-bold text-primary"
            >
              홈
            </Link>
            <Link
              href="/products"
              className="font-headline tracking-tight text-stone-500 transition-colors hover:text-primary"
            >
              사업자 전용
            </Link>
          </nav>
        </div>
        <div className="hidden flex-1 max-w-xl px-8 md:block">
          <div className="group relative">
            <Icon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant/60 transition-colors group-focus-within:text-primary"
            />
            <input
              type="text"
              placeholder="신선한 식재료를 검색해보세요"
              className="w-full rounded-2xl border border-outline-variant/60 bg-surface-container-lowest py-3 pl-14 pr-5 text-sm text-on-surface shadow-ambient transition-all placeholder:text-on-surface-variant/55 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-50 active:scale-95"
            aria-label="장바구니"
          >
            <Icon name="shopping_cart" />
          </Link>
          <Link
            href="/mypage"
            className="rounded-full p-2 text-stone-500 transition-colors hover:bg-stone-50 active:scale-95"
            aria-label="마이페이지"
          >
            <Icon name="person" />
          </Link>
        </div>
      </div>
    </header>
  );
}
