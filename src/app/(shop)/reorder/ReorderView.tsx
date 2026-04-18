"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { ProductImage } from "@/components/shell/ProductImage";
import { sampleOrders } from "@/features/order/mock-data";
import { sampleProducts } from "@/features/product/mock-data";
import { buildReorderItems } from "@/features/reorder/reorder-service";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";

export function ReorderView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdFromQuery = searchParams.get("orderId");

  const selectedOrder = useMemo(
    () =>
      sampleOrders.find((order) => order.id === orderIdFromQuery) ??
      sampleOrders[0],
    [orderIdFromQuery]
  );

  const sourceItems = useMemo(
    () =>
      selectedOrder.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      })),
    [selectedOrder]
  );

  const baseItems = useMemo(
    () =>
      buildReorderItems({
        recentOrderItems: sourceItems,
        products: sampleProducts
      }),
    [sourceItems]
  );

  const discontinuedItems = useMemo(
    () =>
      sourceItems.filter((item) => {
        const product = sampleProducts.find((p) => p.id === item.productId);
        return !product?.isActive;
      }),
    [sourceItems]
  );

  // 사용자가 자유롭게 수량을 조정할 수 있도록 로컬 상태로 관리
  const [draftQuantities, setDraftQuantities] = useState<
    Record<string, number>
  >(() =>
    Object.fromEntries(baseItems.map((item) => [item.productId, item.quantity]))
  );

  // 선택 주문이 바뀌면 수량 초기화
  useEffect(() => {
    setDraftQuantities(
      Object.fromEntries(
        baseItems.map((item) => [item.productId, item.quantity])
      )
    );
  }, [baseItems]);

  const updateQuantity = (productId: string, delta: number) => {
    setDraftQuantities((prev) => {
      const next = (prev[productId] ?? 0) + delta;
      if (next <= 0) {
        const { [productId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: Math.min(99, next) };
    });
  };

  const removeItem = (productId: string) => {
    setDraftQuantities((prev) => {
      const { [productId]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const draftEntries = useMemo(
    () =>
      Object.entries(draftQuantities)
        .map(([productId, quantity]) => ({ productId, quantity }))
        .filter((entry) => entry.quantity > 0),
    [draftQuantities]
  );

  const subtotal = useMemo(
    () =>
      draftEntries.reduce((sum, entry) => {
        const product = sampleProducts.find((p) => p.id === entry.productId);
        return product ? sum + product.priceBusiness * entry.quantity : sum;
      }, 0),
    [draftEntries]
  );

  const cartCustomerType = useCartStore((state) => state.customerType);
  const addToCart = useCartStore((state) => state.addItem);
  const setDraftFromReorder = useCheckoutStore(
    (state) => state.setDraftFromReorder
  );

  const handleSendToCart = () => {
    draftEntries.forEach((entry) =>
      addToCart(entry.productId, entry.quantity)
    );
    router.push("/cart");
  };

  const handleBuyNow = () => {
    setDraftFromReorder(draftEntries, cartCustomerType);
    router.push("/checkout");
  };

  const canSubmit = draftEntries.length > 0;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 md:py-10">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          fast reorder
        </p>
        <h1 className="mt-2 font-headline text-3xl font-black md:text-4xl">
          한 번의 탭으로 다시 담기
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          최근 주문에서 자주 구매한 식자재를 모아두었습니다. 사업자 가격이 자동 적용됩니다.
        </p>
        <p className="mt-2 text-xs font-semibold text-primary">
          현재 선택한 주문: {selectedOrder.orderNumber}
        </p>
      </header>

      {/* Recent Orders carousel */}
      <section className="mb-10">
        <h2 className="mb-4 font-headline text-lg font-bold">최근 주문</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sampleOrders.slice(0, 3).map((order) => {
            const isSelected = order.id === selectedOrder.id;
            return (
              <article
                key={order.id}
                className={
                  "rounded-3xl bg-surface-container-lowest p-5 shadow-lift transition-all " +
                  (isSelected
                    ? "ring-2 ring-primary"
                    : "")
                }
              >
                <p className="text-xs text-on-surface-variant">
                  {order.orderedAt.split(" ")[0]}
                </p>
                <p className="mt-1 font-bold text-on-surface">
                  {order.items[0].productName}
                  {order.items.length > 1 && (
                    <span className="ml-1 text-sm font-normal text-on-surface-variant">
                      외 {order.items.length - 1}건
                    </span>
                  )}
                </p>
                <p className="mt-2 font-headline text-xl font-black text-primary">
                  {formatCurrency(order.total)}
                </p>
                <Link
                  href={`/reorder?orderId=${order.id}#current`}
                  className={
                    "mt-3 flex items-center justify-center gap-1 rounded-full py-2 text-xs font-bold " +
                    (isSelected
                      ? "bg-primary text-white"
                      : "bg-secondary-container/15 text-secondary-container hover:bg-secondary-container/25")
                  }
                >
                  <Icon name="autorenew" className="text-base" />
                  {isSelected ? "현재 선택됨" : "다시 담기"}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <div id="current" className="grid gap-8 md:grid-cols-[1fr_360px]">
        {/* Items */}
        <section className="space-y-4">
          <h2 className="font-headline text-lg font-bold">담을 상품</h2>

          {draftEntries.length === 0 && (
            <div className="rounded-3xl border-2 border-dashed border-outline-variant/40 bg-surface-container-low p-10 text-center text-sm text-on-surface-variant">
              담을 상품이 없습니다. 위에서 다른 주문을 선택하거나 수량을 다시 추가하세요.
            </div>
          )}

          {draftEntries.map((entry) => {
            const product = sampleProducts.find(
              (p) => p.id === entry.productId
            );
            if (!product) return null;
            return (
              <article
                key={entry.productId}
                className="flex gap-4 rounded-3xl bg-surface-container-lowest p-4 shadow-lift"
              >
                <div className="h-20 w-20 flex-none overflow-hidden rounded-2xl bg-surface-container-low">
                  <ProductImage
                    emoji={product.imageEmoji}
                    bg={product.imageBg}
                    imageUrl={product.imageUrl}
                    alt={product.name}
                    size="lg"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold">{product.name}</p>
                      <p className="text-xs text-on-surface-variant">
                        {product.unit}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="제외"
                      onClick={() => removeItem(entry.productId)}
                      className="text-on-surface-variant/50 hover:text-error"
                    >
                      <Icon name="close" className="text-base" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center overflow-hidden rounded-full border border-outline-variant bg-white">
                      <button
                        type="button"
                        aria-label="수량 감소"
                        onClick={() => updateQuantity(entry.productId, -1)}
                        className="px-3 py-1 text-on-surface-variant hover:text-primary"
                      >
                        <Icon name="remove" className="text-base" />
                      </button>
                      <span className="px-3 text-sm font-bold">
                        {entry.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="수량 증가"
                        onClick={() => updateQuantity(entry.productId, 1)}
                        className="px-3 py-1 text-on-surface-variant hover:text-primary"
                      >
                        <Icon name="add" className="text-base" />
                      </button>
                    </div>
                    <span className="font-headline font-bold text-primary">
                      {formatCurrency(product.priceBusiness * entry.quantity)}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}

          {discontinuedItems.length > 0 && (
            <div className="rounded-3xl border-2 border-dashed border-outline-variant bg-surface-container-low p-5">
              <h3 className="mb-3 flex items-center gap-2 font-bold text-on-surface-variant">
                <Icon name="info" />
                재주문에서 제외된 상품
              </h3>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                {discontinuedItems.map((item) => {
                  const product = sampleProducts.find(
                    (p) => p.id === item.productId
                  );
                  return (
                    <li key={item.productId} className="flex items-center gap-2">
                      <span className="text-lg">{product?.imageEmoji}</span>
                      <span className="line-through">
                        {product?.name ?? item.productId}
                      </span>
                      <span className="rounded-full bg-error-container/40 px-2 py-0.5 text-xs font-bold text-on-error-container">
                        판매 종료
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>

        {/* Summary */}
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="space-y-4 rounded-3xl bg-surface-container-low p-6">
            <h2 className="font-headline text-lg font-bold">주문 요약</h2>
            <p className="text-xs text-on-surface-variant">
              {draftEntries.length}개 상품 · 사업자 가격 자동 적용
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">상품 금액</span>
                <span className="font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">배송비</span>
                <span className="font-bold text-primary">무료</span>
              </div>
            </div>
            <div className="border-t border-surface-container-highest pt-3">
              <div className="flex items-baseline justify-between">
                <span className="text-base font-bold">결제 예상 금액</span>
                <span className="font-headline text-2xl font-black text-primary">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!canSubmit}
              className={
                "block w-full rounded-xl py-4 text-center font-bold transition-all " +
                (canSubmit
                  ? "bg-secondary-container text-on-secondary hover:opacity-90 active:scale-[0.98]"
                  : "cursor-not-allowed bg-surface-container-high text-on-surface-variant")
              }
            >
              한 번에 주문하기
            </button>
            <button
              type="button"
              onClick={handleSendToCart}
              disabled={!canSubmit}
              className={
                "block w-full rounded-xl border border-outline-variant bg-white py-3 text-center text-sm font-bold transition-all " +
                (canSubmit
                  ? "text-on-surface hover:border-primary"
                  : "cursor-not-allowed text-on-surface-variant/50")
              }
            >
              장바구니로 보내기
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
