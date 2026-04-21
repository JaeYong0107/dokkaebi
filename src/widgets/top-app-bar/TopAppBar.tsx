"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getUnitPrice } from "@/features/pricing/pricing-service";
import { UserMenu } from "@/components/shell/UserMenu";
import { useProductsQuery } from "@/shared/hooks/use-products-query";
import { formatCurrency } from "@/shared/lib/format";
import { Icon } from "@/shared/ui/Icon";
import { Logo } from "@/shared/ui/Logo";

export function TopAppBar() {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { products } = useProductsQuery();

  const trimmedQuery = query.trim().toLowerCase();
  const suggestions = (
    trimmedQuery
      ? products.filter((product) => {
          const keyword = [
            product.name,
            product.category,
            product.origin,
            product.description
          ]
            .join(" ")
            .toLowerCase();

          return keyword.includes(trimmedQuery);
        })
      : products
  )
    .filter((product) => product.isActive)
    .slice(0, 5);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  function handleSubmit() {
    if (suggestions.length > 0) {
      setIsOpen(false);
      setQuery(suggestions[0].name);
      router.push(`/products/${suggestions[0].id}`);
      return;
    }

    router.push("/products");
    setIsOpen(false);
  }

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
          <div ref={searchRef} className="group relative">
            <Icon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant/60 transition-colors group-focus-within:text-primary"
            />
            <input
              type="text"
              placeholder="신선한 식재료를 검색해보세요"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSubmit();
                }
              }}
              className="w-full rounded-2xl border border-outline-variant/60 bg-surface-container-lowest py-3 pl-14 pr-5 text-sm text-on-surface shadow-ambient transition-all placeholder:text-on-surface-variant/55 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
            {isOpen ? (
              <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] overflow-hidden rounded-[1.75rem] border border-outline-variant/50 bg-surface-container-lowest shadow-panel">
                <div className="border-b border-outline-variant/40 px-5 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold tracking-[0.18em] text-on-surface-variant/70">
                      {trimmedQuery ? "추천 검색 결과" : "인기 상품 바로가기"}
                    </p>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="text-xs font-bold text-primary transition-opacity hover:opacity-70"
                    >
                      {suggestions.length > 0 ? "첫 상품 보기" : "전체 상품 보기"}
                    </button>
                  </div>
                </div>

                {suggestions.length > 0 ? (
                  <div className="py-2">
                    {suggestions.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={() => {
                          setQuery(product.name);
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-surface-container-low"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface-container-low text-xl">
                          {product.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span aria-hidden>{product.imageEmoji}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="mb-1 text-xs font-semibold text-on-surface-variant">
                            {product.category} · {product.origin}
                          </p>
                          <p className="truncate text-sm font-bold text-on-surface">
                            {product.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-on-surface-variant">
                            사업자 특가
                          </p>
                          <p className="text-sm font-black text-primary">
                            {formatCurrency(getUnitPrice(product, "BUSINESS"))}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-5 py-5 text-sm text-on-surface-variant">
                    <Icon name="search_off" className="text-base" />
                    일치하는 상품이 없어 전체 상품 페이지로 이동할 수 있어요.
                  </div>
                )}
              </div>
            ) : null}
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
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
