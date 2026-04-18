"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { ProductImage } from "@/components/shell/ProductImage";
import { buildCartSummary } from "@/features/cart/cart-service";
import { sampleProducts } from "@/features/product/mock-data";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import {
  useCheckoutStore,
  type PaymentMethod
} from "@/store/checkout-store";

const PAYMENT_METHODS: ReadonlyArray<{
  key: PaymentMethod;
  label: string;
  icon: string;
}> = [
  { key: "easy", label: "간편결제", icon: "account_balance_wallet" },
  { key: "card", label: "신용카드", icon: "credit_card" },
  { key: "transfer", label: "계좌이체", icon: "currency_exchange" },
  { key: "phone", label: "휴대폰결제", icon: "smartphone" }
];

function sourceLabel(source: string) {
  if (source === "buy-now") return "바로 구매";
  if (source === "reorder") return "재주문";
  return "장바구니";
}

function submitButtonLabel({
  canSubmit,
  minimumSatisfied,
  total
}: {
  canSubmit: boolean;
  minimumSatisfied: boolean;
  total: number;
}) {
  if (canSubmit) return `${formatCurrency(total)} 결제하기`;
  if (!minimumSatisfied) return "최소 주문 금액 미달";
  return "필수 동의 후 결제 가능";
}

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

export default function CheckoutPage() {
  const router = useRouter();

  const cartItems = useCartStore((state) => state.items);
  const cartCustomerType = useCartStore((state) => state.customerType);
  const clearCart = useCartStore((state) => state.clear);

  const draftItems = useCheckoutStore((state) => state.draftItems);
  const draftCustomerType = useCheckoutStore((state) => state.customerType);
  const source = useCheckoutStore((state) => state.source);
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);
  const taxInvoiceRequested = useCheckoutStore(
    (state) => state.taxInvoiceRequested
  );
  const agreedToOrder = useCheckoutStore((state) => state.agreedToOrder);
  const agreedToPrivacy = useCheckoutStore((state) => state.agreedToPrivacy);
  const setDraftFromCart = useCheckoutStore((state) => state.setDraftFromCart);
  const setPaymentMethod = useCheckoutStore((state) => state.setPaymentMethod);
  const setTaxInvoiceRequested = useCheckoutStore(
    (state) => state.setTaxInvoiceRequested
  );
  const setAgreedToOrder = useCheckoutStore((state) => state.setAgreedToOrder);
  const setAgreedToPrivacy = useCheckoutStore(
    (state) => state.setAgreedToPrivacy
  );
  const clearCheckout = useCheckoutStore((state) => state.clear);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  // draft 가 비어 있으면 cart 항목을 자동 시드 → /cart "주문하기" → /checkout 동선이 끊기지 않도록
  useEffect(() => {
    if (!hydrated) return;
    if (draftItems.length === 0 && cartItems.length > 0) {
      setDraftFromCart(cartItems, cartCustomerType);
    }
  }, [
    hydrated,
    draftItems.length,
    cartItems,
    cartCustomerType,
    setDraftFromCart
  ]);

  const items = draftItems.length > 0 ? draftItems : cartItems;
  const customerType =
    draftItems.length > 0 ? draftCustomerType : cartCustomerType;
  const effectiveSource = draftItems.length > 0 ? source : "cart";

  const summary = useMemo(
    () =>
      buildCartSummary({
        customerType,
        items,
        products: sampleProducts
      }),
    [customerType, items]
  );

  const productById = useMemo(
    () => Object.fromEntries(sampleProducts.map((p) => [p.id, p])),
    []
  );

  const discount = useMemo(
    () =>
      items.reduce((sum, line) => {
        const product = productById[line.productId];
        if (!product) return sum;
        return sum + (product.priceNormal - product.priceBusiness) * line.quantity;
      }, 0),
    [items, productById]
  );

  const canSubmit =
    agreedToOrder &&
    agreedToPrivacy &&
    items.length > 0 &&
    summary.minimumOrder.isSatisfied;

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (effectiveSource === "cart") {
      clearCart();
    }
    clearCheckout();
    router.push("/orders/complete");
  };

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-screen-2xl px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tighter text-primary">
            주문/결제
          </h1>
        </header>
        <div className="rounded-xl bg-surface-container-low p-12 text-center text-on-surface-variant">
          결제 정보를 불러오는 중...
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-screen-2xl px-8 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tighter text-primary">
            주문/결제
          </h1>
        </header>
        <div className="rounded-xl bg-surface-container-low p-16 text-center">
          <Icon
            name="shopping_basket"
            className="mb-4 text-5xl text-on-surface-variant"
          />
          <p className="mb-6 text-on-surface-variant">
            결제할 상품이 없습니다. 장바구니부터 채워주세요.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
          >
            상품 둘러보기
            <Icon name="arrow_forward" className="text-base" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-2xl px-8 py-12">
      {/* Page Title */}
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tighter text-primary">
          주문/결제
        </h1>
        <p className="mt-2 font-medium text-on-surface-variant">
          안전하고 빠른 결제를 진행해 주세요.
        </p>
      </header>

      <div className="flex flex-col gap-12 lg:flex-row">
        {/* Left Column */}
        <div className="flex-1 space-y-12">
          {/* Shipping */}
          <section className="rounded-xl bg-surface-container-low p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                배송지 정보
              </h2>
              <button className="text-sm font-bold text-primary hover:underline">
                배송지 변경
              </button>
            </div>
            <div className="space-y-3 rounded-xl bg-surface-container-lowest p-6">
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-on-primary">
                  기본배송지
                </span>
                <span className="text-lg font-bold">김도깨비</span>
              </div>
              <p className="leading-relaxed text-on-surface-variant">
                [06234] 서울특별시 강남구 테헤란로 427
                <br />
                위워크 타워 15층
              </p>
              <p className="text-sm text-on-surface-variant">010-1234-5678</p>
              <div className="border-t border-outline-variant/15 pt-4">
                <select className="w-full rounded-lg border-none bg-surface-container-high px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-primary">
                  <option>배송 요청사항을 선택해주세요</option>
                  <option>문 앞에 놓아주세요</option>
                  <option>경비실에 맡겨주세요</option>
                  <option>배송 전 연락 부탁드립니다</option>
                  <option>직접 입력</option>
                </select>
              </div>
            </div>
          </section>

          {/* Order Items */}
          <section className="rounded-xl bg-surface-container-low p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                주문 상품 확인 ({summary.items.length})
              </h2>
              {effectiveSource && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {sourceLabel(effectiveSource)}
                </span>
              )}
            </div>
            <div className="space-y-4">
              {summary.items.map((line) => {
                const product = productById[line.productId];
                if (!product) return null;
                const sku = SKU_MAP[product.id] ?? product.id;
                const showOriginal = product.priceNormal > line.unitPrice;
                return (
                  <div
                    key={line.productId}
                    className="group relative flex items-center gap-6 overflow-hidden rounded-xl bg-surface-container-lowest p-4"
                  >
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
                      <ProductImage
                        emoji={product.imageEmoji}
                        bg={product.imageBg}
                        size="md"
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold">{product.name}</h3>
                        <p className="mt-1 text-xs text-on-surface-variant">
                          SKU: {sku} | {line.quantity}{product.unit.includes("/") ? "" : "개"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          {formatCurrency(line.lineTotal)}
                        </div>
                        {showOriginal && (
                          <div className="text-sm text-on-surface-variant line-through">
                            {formatCurrency(
                              product.priceNormal * line.quantity
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Payment Method */}
          <section className="rounded-xl bg-surface-container-low p-8">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-on-surface">
              결제 수단
            </h2>
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {PAYMENT_METHODS.map((method) => {
                const isActive = paymentMethod === method.key;
                return (
                  <button
                    key={method.key}
                    type="button"
                    onClick={() => setPaymentMethod(method.key)}
                    aria-pressed={isActive}
                    className={
                      isActive
                        ? "flex flex-col items-center justify-center gap-2 rounded-xl bg-primary p-4 text-on-primary ring-2 ring-primary"
                        : "flex flex-col items-center justify-center gap-2 rounded-xl bg-surface-container-lowest p-4 text-on-surface-variant transition-colors hover:bg-surface-container-high"
                    }
                  >
                    <Icon name={method.icon} />
                    <span className="text-sm font-bold">{method.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="rounded-xl border border-outline-variant/20 bg-surface-container-highest/30 p-6">
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={taxInvoiceRequested}
                  onChange={(event) =>
                    setTaxInvoiceRequested(event.target.checked)
                  }
                  className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span className="font-bold text-on-surface transition-colors group-hover:text-primary">
                  사업자용 지출증빙 신청
                </span>
                <span className="text-xs font-medium text-on-surface-variant">
                  (세금계산서/현금영수증)
                </span>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column: Summary */}
        <aside className="w-full lg:w-[400px]">
          <div className="sticky top-28 rounded-2xl bg-surface-container-high p-8 shadow-sm">
            <h2 className="mb-8 text-xl font-extrabold tracking-tight">
              최종 결제 금액
            </h2>
            <div className="mb-8 space-y-4">
              <div className="flex justify-between text-on-surface-variant">
                <span>총 상품금액</span>
                <span className="font-medium">
                  {formatCurrency(
                    items.reduce((sum, line) => {
                      const p = productById[line.productId];
                      return p ? sum + p.priceNormal * line.quantity : sum;
                    }, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>배송비</span>
                <span className="font-medium">
                  {summary.shippingFee === 0
                    ? "무료"
                    : formatCurrency(summary.shippingFee)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>사업자 할인</span>
                  <span className="font-medium">
                    -{formatCurrency(discount)}
                  </span>
                </div>
              )}
              <div className="flex items-end justify-between border-t border-outline-variant/30 pt-4">
                <span className="text-lg font-bold">결제 예정 금액</span>
                <span className="text-3xl font-black tracking-tighter text-secondary-container">
                  {formatCurrency(summary.totalAmount)}
                </span>
              </div>
            </div>
            <div className="mb-8 space-y-3">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreedToOrder}
                  onChange={(event) => setAgreedToOrder(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span className="text-xs leading-tight text-on-surface-variant">
                  주문할 상품의 상품명, 상품가격, 배송정보를 확인하였으며, 구매에 동의하시겠습니까? (전자상거래법 제8조 제2항)
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreedToPrivacy}
                  onChange={(event) => setAgreedToPrivacy(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span className="text-xs leading-tight text-on-surface-variant">
                  개인정보 수집 및 이용 동의 (필수)
                </span>
              </label>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={
                canSubmit
                  ? "block w-full rounded-xl bg-secondary-container py-5 text-center text-xl font-black text-on-secondary-container shadow-lg shadow-secondary-container/20 transition-all hover:opacity-90 active:scale-[0.98]"
                  : "block w-full cursor-not-allowed rounded-xl bg-surface-container-high py-5 text-center text-xl font-black text-on-surface-variant"
              }
            >
              {submitButtonLabel({
                canSubmit,
                minimumSatisfied: summary.minimumOrder.isSatisfied,
                total: summary.totalAmount
              })}
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant/60">
              <Icon name="shield" className="text-sm" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Secure Checkout Powered by Dokkaebi Pay
              </span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
