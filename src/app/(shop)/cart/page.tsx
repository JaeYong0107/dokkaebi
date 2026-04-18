"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { ProductImage } from "@/components/shell/ProductImage";
import { buildCartSummary } from "@/features/cart/cart-service";
import { sampleProducts } from "@/features/product/mock-data";
import { formatCurrency } from "@/lib/format";
import {
  useCartStore,
  useCartItems,
  useCartCustomerType
} from "@/store/cart-store";

const RECOMMENDATIONS = [
  {
    region: "경상남도 창녕",
    name: "깐마늘 1kg (업소용)",
    productId: "prod-garlic-001",
    badge: "베스트",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7WBX3sfkBRLz4iCLsP0AMMc-lfnEZzsRxRR1vCGuqaLEHF5iGfSomSjO_RNjmUycA26zULfRS_J6GULbI2YiIrKbGDDo2YYZRGY_fjmv-Fyr5-OAkwqTCqJIyMwiUllAcugXlH_TfEWWwRJltUD1GAYjj-PEL5YCa_PMTd11azQwhUHqu3Pcxbi5eQ8zpbSeRL9F2h5aohe5oCkGMioynkpUSgM3jny4tlB32QqhBsDOEuC-NOn1T7-AjMDCCHkh0Q_9ZZzVSi9k",
    alt: "Garlic"
  },
  {
    region: "전라남도 무안",
    name: "청양고추 2kg (박스)",
    productId: null,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdVnkQb5FHKX2ffnSSguNtaYxHbjY_scwqF0vFSUSzXpL7ayzUb9xoCzkkikc1H3dwn4gAsHfq23DvjNuLG6pZjXemK4Pe4jy4OTYWpET2vXbXDIMKHgvxeIjQ_aeLEjq2Hs7uW6KcHgVbaTCsP5c9NKIXGQpWCrslNAiuL2IQFz-U8RNCYor6dU6rW7LSZDj97B65wBWm6YPVVxD1kqMHjzN32RtQwc9XpqPt700RWF0I-Xuus1UM9Jz2Swvvc6OLNavfwinF8pA",
    alt: "Chili peppers"
  },
  {
    region: "전라남도 무안",
    name: "햇양파 (대용량)",
    productId: "prod-onion-001",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuAaBVTjQk5GOTtQwedoN1jRZQppb4SL1HuyCOd2BM3lQ6a_MofuKKfitLjsXwbsYOhpeSBZD2P2ydJ6ZsL0gJ7E8sYRellm1gE-DVO6pAk4e2DwAzX7q9IGnvcA7jioZ8wCfgnsYaxSWL5swBnXge6GFKvyeQBv7B8v_CvWYuwV1i6tzdMMxqd3l2SBH67xUIlpLx_gAEOGruuRml17kLHZ35tIFpK5bQ0zaZngSGoSZBefZxjh37q_djnZ28h9E3b7l6Hba8nNY",
    alt: "Yellow onions"
  },
  {
    region: "강원도 고랭지",
    name: "양배추 3망 (업소용)",
    productId: null,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDWrfRaIBaqdRqhzuuIs6zWly7s_j6LRkOFx0PHvBxLbTC6223iXS3jSPA1u8kEd7IhoGHuhgUlDUL9wGI_XIf6SMCFDqr1HCScUDuwbQicDVRW_YgEm1opv84fta0zS8BwvXEgMr_zJBecvqs9QBYNoxL_xKJuWc8-97z3zC69MBsCLZxMEys1YPP8xUNijr5xR1nSHqnEasQH_ryxA2Z-6tMpETJZ08-9gf-6ul4M6q6-09c6QqowB9tQ_-r6ChML5RMS50wQDg",
    alt: "Cabbage"
  }
];

const SKU_MAP: Record<string, string> = {
  "prod-lettuce-001": "DKB-VG-001",
  "prod-onion-001": "DKB-VG-042",
  "prod-carrot-001": "DKB-VG-118",
  "prod-broccoli-001": "DKB-VG-205",
  "prod-tomato-001": "DKB-VG-307",
  "prod-watermelon-001": "DKB-FR-415",
  "prod-lemon-001": "DKB-FR-218",
  "prod-egg-001": "DKB-DA-090",
  "prod-pork-001": "DKB-MT-061",
  "prod-oil-001": "DKB-PD-024",
  "prod-potato-001": "DKB-VG-512",
  "prod-cucumber-001": "DKB-VG-622",
  "prod-garlic-001": "DKB-VG-755",
  "prod-pineapple-001": "DKB-FR-911"
};

const MIN_ORDER_BUSINESS = 50000;

export default function CartPage() {
  const items = useCartItems();
  const customerType = useCartCustomerType();
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const summary = useMemo(
    () => buildCartSummary({ customerType, items, products: sampleProducts }),
    [customerType, items]
  );

  const productById = useMemo(
    () => Object.fromEntries(sampleProducts.map((p) => [p.id, p])),
    []
  );

  const minOrderProgress = Math.min(
    100,
    Math.round((summary.subtotal / MIN_ORDER_BUSINESS) * 100)
  );
  const remainingToMin = Math.max(0, MIN_ORDER_BUSINESS - summary.subtotal);

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
              const sku = SKU_MAP[product.id] ?? product.id;
              const showOriginal = product.priceNormal > line.unitPrice;
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
                              product.priceNormal * line.quantity
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
            <Link
              href="/checkout"
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
            </Link>
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
          {RECOMMENDATIONS.map((rec) => {
            const productId = rec.productId;
            const wrapperContent = (
              <div className="overflow-hidden rounded-2xl bg-surface-container-low transition-shadow group-hover:shadow-lift">
                <div className="relative h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rec.img}
                    alt={rec.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {productId && (
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
                  )}
                </div>
                <div className="p-5">
                  <p className="mb-1 text-[10px] font-bold text-on-surface-variant">
                    {rec.region}
                  </p>
                  <h3 className="mb-3 text-sm font-bold">{rec.name}</h3>
                  {rec.badge && (
                    <span className="rounded bg-primary-fixed px-1.5 text-[10px] font-bold text-primary">
                      {rec.badge}
                    </span>
                  )}
                </div>
              </div>
            );
            return productId ? (
              <Link
                key={rec.name}
                href={`/products/${productId}`}
                className="group block"
              >
                {wrapperContent}
              </Link>
            ) : (
              <article key={rec.name} className="group">
                {wrapperContent}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
