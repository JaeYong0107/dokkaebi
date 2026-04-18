"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ProductImage } from "@/entities/product/ui/ProductImage";
import { buildCartSummary } from "@/features/cart/cart-service";
import { getOriginalPrice } from "@/features/pricing/pricing-service";
import { formatCurrency } from "@/shared/lib/format";
import { useProductsQuery } from "@/shared/hooks/use-products-query";
import { Icon } from "@/shared/ui/Icon";
import {
  useCartStore,
  useCartItems,
  useCartCustomerType
} from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";

const MIN_ORDER_BUSINESS = 50000;

export default function CartPage() {
  const router = useRouter();
  const items = useCartItems();
  const customerType = useCartCustomerType();
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);
  const setDraftFromCart = useCheckoutStore((state) => state.setDraftFromCart);
  const { products, isLoading: productsLoading } = useProductsQuery();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const summary = useMemo(
    () => buildCartSummary({ customerType, items, products }),
    [customerType, items, products]
  );

  const productById = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p])),
    [products]
  );
  const recommendations = useMemo(
    () =>
      products
        .filter((product) => product.isActive)
        .filter((product) => !items.some((item) => item.productId === product.id))
        .sort((a, b) => (a.stockQuantity ?? 999) - (b.stockQuantity ?? 999))
        .slice(0, 4),
    [items, products]
  );

  const minOrderProgress = Math.min(
    100,
    Math.round((summary.subtotal / MIN_ORDER_BUSINESS) * 100)
  );
  const remainingToMin = Math.max(0, MIN_ORDER_BUSINESS - summary.subtotal);

  const handleCheckout = () => {
    setDraftFromCart(items, customerType);
    router.push("/checkout");
  };

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-screen-2xl px-8 pb-24 pt-10">
        <div className="mb-8 flex items-baseline">
          <h1 className="mr-4 font-headline text-4xl font-black tracking-tight text-primary">
            장바구니
          </h1>
        </div>
        <div className="rounded-3xl bg-surface-container-low p-12 text-center text-on-surface-variant">
          장바구니를 불러오는 중...
        </div>
      </main>
    );
  }

  if (productsLoading) {
    return (
      <main className="mx-auto max-w-screen-2xl px-8 pb-24 pt-10">
        <div className="mb-8 flex items-baseline">
          <h1 className="mr-4 font-headline text-4xl font-black tracking-tight text-primary">
            장바구니
          </h1>
        </div>
        <div className="rounded-3xl bg-surface-container-low p-12 text-center text-on-surface-variant">
          상품 정보를 불러오는 중...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-8 pb-24 pt-10">
      <div className="mb-8 flex items-baseline">
        <h1 className="mr-4 font-headline text-4xl font-black tracking-tight text-primary">
          장바구니
        </h1>
        <span className="font-medium text-on-surface-variant">
          총 {items.length}개의 상품이 담겨있습니다.
        </span>
      </div>
      <div className="grid grid-cols-12 items-start gap-8">
        {/* Cart Items */}
        <div className="col-span-12 space-y-4 lg:col-span-8">
          {summary.items.length === 0 ? (
            <div className="rounded-xl bg-surface-container-lowest p-12 text-center">
              <Icon
                name="shopping_basket"
                className="mb-4 text-5xl text-on-surface-variant"
              />
              <p className="mb-4 text-on-surface-variant">
                장바구니가 비어 있습니다.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
              >
                상품 둘러보기
                <Icon name="arrow_forward" className="text-base" />
              </Link>
            </div>
          ) : (
            summary.items.map((line) => {
              const product = productById[line.productId];
              if (!product) return null;
              const sku = product.sku ?? product.id;
              const originalPrice = getOriginalPrice(product);
              const showOriginal = originalPrice > line.unitPrice;
              return (
                <article
                  key={line.productId}
                  className="group flex items-center gap-6 rounded-xl bg-surface-container-lowest p-6 transition-all duration-300"
                >
                  <Link
                    href={`/products/${product.id}`}
                    className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-container-low"
                  >
                    <ProductImage
                      imageUrl={product.imageUrl}
                      alt={product.name}
                      emoji={product.imageEmoji}
                      bg={product.imageBg}
                      size="md"
                    />
                  </Link>
                  <div className="flex flex-grow flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-primary">
                        {product.badges?.[0] ?? product.category}
                      </span>
                      <Link
                        href={`/products/${product.id}`}
                        className="font-headline text-lg font-bold leading-tight hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        SKU: {sku}
                      </p>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="flex items-center rounded-full bg-surface-container-high px-2 py-1">
                        <button
                          type="button"
                          aria-label="수량 감소"
                          onClick={() =>
                            updateQuantity(line.productId, line.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center font-bold text-primary"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-sm font-bold">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="수량 증가"
                          onClick={() =>
                            updateQuantity(line.productId, line.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center font-bold text-primary"
                        >
                          +
                        </button>
                      </div>
                      <div className="min-w-[100px] text-right">
                        {showOriginal && (
                          <p className="text-sm text-on-surface-variant line-through">
                            {formatCurrency(
                              originalPrice * line.quantity
                            )}
                          </p>
                        )}
                        <p className="font-headline text-xl font-extrabold text-primary">
                          {formatCurrency(line.lineTotal)}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="장바구니에서 삭제"
                        onClick={() => removeItem(line.productId)}
                        className="text-on-surface-variant/40 transition-colors hover:text-error"
                      >
                        <Icon name="close" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
          <Link
            href="/products"
            className="group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/30 py-10 text-on-surface-variant/60 transition-all hover:border-primary/30 hover:bg-surface-container-low"
          >
            <Icon
              name="add_circle"
              className="mb-2 text-3xl transition-transform group-hover:scale-110"
            />
            <span className="text-sm font-bold">식재료 더 담기</span>
          </Link>
        </div>

        {/* Summary Sidebar */}
        <aside className="sticky top-28 col-span-12 lg:col-span-4">
          <div className="rounded-2xl bg-surface-container-low p-8">
            <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-black">
              <Icon name="receipt_long" className="text-primary" />
              주문 요약 정보
            </h2>
            <div className="mb-8 rounded-xl bg-surface-container-lowest p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface-variant">
                  최소 주문 금액 ({formatCurrency(MIN_ORDER_BUSINESS)})
                </span>
                <span
                  className={
                    "text-xs font-bold italic " +
                    (summary.minimumOrder.isSatisfied
                      ? "text-primary"
                      : "text-error")
                  }
                >
                  {summary.minimumOrder.isSatisfied
                    ? "달성 완료!"
                    : `${formatCurrency(remainingToMin)} 부족`}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-container transition-all"
                  style={{ width: `${minOrderProgress}%` }}
                />
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-on-surface-variant">
                {summary.minimumOrder.isSatisfied ? (
                  <>
                    <span className="font-bold text-primary">사업자 회원님,</span>{" "}
                    현재 무료 배송 조건 및 최소 주문 금액을 충족하셨습니다.
                  </>
                ) : (
                  <>최소 주문 금액 충족 시 결제로 이동할 수 있습니다.</>
                )}
              </p>
            </div>
            <div className="mb-8 space-y-4 border-b border-outline-variant/20 pb-6 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">총 상품 금액</span>
                <span className="font-bold">{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-on-surface-variant">배송비</span>
                  {customerType === "BUSINESS" && (
                    <span className="rounded bg-primary-fixed px-1.5 py-0.5 text-[10px] font-bold text-on-primary-fixed">
                      사업자
                    </span>
                  )}
                </div>
                <span className="font-bold text-primary">
                  {summary.shippingFee === 0
                    ? "0원"
                    : formatCurrency(summary.shippingFee)}
                </span>
              </div>
            </div>
            <div className="mb-8 flex items-end justify-between">
              <span className="text-lg font-bold">예상 결제 금액</span>
              <span className="font-headline text-4xl font-extrabold tracking-tighter text-primary">
                {formatCurrency(summary.totalAmount)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              aria-disabled={!summary.minimumOrder.isSatisfied || items.length === 0}
              className={
                "mb-4 flex w-full items-center justify-center gap-3 rounded-xl py-5 font-headline text-xl font-black transition-all " +
                (summary.minimumOrder.isSatisfied && items.length > 0
                  ? "bg-secondary-container text-on-secondary-container shadow-lg shadow-secondary/10 hover:opacity-90 active:scale-95"
                  : "pointer-events-none bg-surface-container-highest text-on-surface-variant/40")
              }
            >
              주문하기
              <Icon name="arrow_forward" />
            </button>
            <p className="text-center text-[10px] text-on-surface-variant/70">
              법인 결제 및 세금계산서 발행은 결제 단계에서 가능합니다.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface/50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="verified" />
            </div>
            <div>
              <h4 className="text-xs font-bold">새벽 배송 보장</h4>
              <p className="text-[10px] text-on-surface-variant">
                내일 오전 7시 전 도착 예정
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Recommended Section */}
      <section className="mt-24">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-secondary">
              Together With
            </span>
            <h2 className="font-headline text-3xl font-black">
              이 상품과 함께 많이 주문했어요
            </h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-bold text-primary"
          >
            전체보기 <Icon name="open_in_new" className="text-sm" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {recommendations.map((rec, index) => {
            const productId = rec.id;
            const wrapperContent = (
              <div className="overflow-hidden rounded-2xl bg-surface-container-low transition-shadow group-hover:shadow-lift">
                <div className="relative h-48 overflow-hidden">
                  <ProductImage
                    imageUrl={rec.imageUrl}
                    alt={rec.name}
                    emoji={rec.imageEmoji}
                    bg={rec.imageBg}
                    size="lg"
                  />
                  <button
                    type="button"
                    aria-label="장바구니에 담기"
                    onClick={(event) => {
                      event.preventDefault();
                      addItem(productId, 1);
                    }}
                    className="absolute bottom-2 right-2 rounded-full bg-primary p-2 text-white shadow-lg transition-transform hover:scale-110"
                  >
                    <Icon name="add_shopping_cart" />
                  </button>
                </div>
                <div className="p-5">
                  <p className="mb-1 text-[10px] font-bold text-on-surface-variant">
                    {rec.origin}
                  </p>
                  <h3 className="mb-3 text-sm font-bold">{rec.name}</h3>
                  {(rec.badges?.[0] ?? index === 0 ? rec.badges?.[0] ?? "추천" : null) ? (
                    <span className="rounded bg-primary-fixed px-1.5 text-[10px] font-bold text-primary">
                      {rec.badges?.[0] ?? "추천"}
                    </span>
                  ) : null}
                </div>
              </div>
            );
            return (
              <Link
                key={rec.id}
                href={`/products/${productId}`}
                className="group block"
              >
                {wrapperContent}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
