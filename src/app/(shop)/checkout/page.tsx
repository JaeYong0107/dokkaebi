import Link from "next/link";
import { Icon } from "@/components/common/Icon";

const ORDER_ITEMS = [
  {
    name: "[B2B 특가] 유기농 완토 5kg",
    sku: "SKU: TOM-882-ORG | 1박스",
    priceSale: "₩24,900",
    priceOriginal: "₩32,000",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXCtmJHRdixc0ohYMwyuHpc99sWq8NSf9p6Um8i0jjMhAP3Yv4Sg3Vh5oQGrNKN0YjHnl2U-exzaJVyqzXMmv2f9V_an2iY5G3UL58DIlg1UZtQSb1M159OZWd-KBOMhWgzhyTN1hwWsjQzNuE0-h-4o147b4-Ll5u5L5OO15ZaSp7cgpEEVZwQTZBsD1kE9ntnR82BEmNgxAwRDcQvILN3PT3P31O-gROHvxmGzSIRE3j9ky1-egT93-tix9Q9dw05IJvqixL4eM",
    alt: "Organic Tomatoes"
  },
  {
    name: "제주 흙당근 10kg (중상급)",
    sku: "SKU: CAR-012-JEJU | 1박스",
    priceSale: "₩18,500",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKePu0-W-WVF-tUi0itq-G1xrzI4eXt4h-gvNHojMljPqH6MlQgR_ek3zabYOAsE4-yrvrLvi0N3_SSV6sZ2QV6jamzo4wvU2TssADWcGakX8l1GntJt9ALNeRlkiQn0sg6IPNFpIzn-EDyaulXdRMv2h64GftZHkKuVX1cbg1iVg98a4QU2eseMV2kjhjV9hs08jkp4W0NfLVyGas-fuelgV8e3EJtVwyLb0kLVsC62n5B7A2t0jIqlupeStDdqkVeTaew2ZgeZQ",
    alt: "Carrots"
  }
];

const PAYMENT_METHODS = [
  { label: "간편결제", icon: "account_balance_wallet", active: true },
  { label: "신용카드", icon: "credit_card" },
  { label: "계좌이체", icon: "currency_exchange" },
  { label: "휴대폰결제", icon: "smartphone" }
];

export default function CheckoutPage() {
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
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-on-surface">
              주문 상품 확인 (3)
            </h2>
            <div className="space-y-4">
              {ORDER_ITEMS.map((item) => (
                <div
                  key={item.name}
                  className="group relative flex items-center gap-6 overflow-hidden rounded-xl bg-surface-container-lowest p-4"
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.img}
                      alt={item.alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p className="mt-1 text-xs text-on-surface-variant">
                        {item.sku}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">
                        {item.priceSale}
                      </div>
                      {item.priceOriginal && (
                        <div className="text-sm text-on-surface-variant line-through">
                          {item.priceOriginal}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payment Method */}
          <section className="rounded-xl bg-surface-container-low p-8">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-on-surface">
              결제 수단
            </h2>
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.label}
                  className={
                    method.active
                      ? "flex flex-col items-center justify-center gap-2 rounded-xl bg-primary p-4 text-on-primary ring-2 ring-primary"
                      : "flex flex-col items-center justify-center gap-2 rounded-xl bg-surface-container-lowest p-4 text-on-surface-variant transition-colors hover:bg-surface-container-high"
                  }
                >
                  <Icon name={method.icon} />
                  <span className="text-sm font-bold">{method.label}</span>
                </button>
              ))}
            </div>
            <div className="rounded-xl border border-outline-variant/20 bg-surface-container-highest/30 p-6">
              <label className="group flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
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
                <span className="font-medium">₩43,400</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>배송비</span>
                <span className="font-medium">₩3,000</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>B2B 회원 할인</span>
                <span className="font-medium">-₩4,000</span>
              </div>
              <div className="flex items-end justify-between border-t border-outline-variant/30 pt-4">
                <span className="text-lg font-bold">결제 예정 금액</span>
                <span className="text-3xl font-black tracking-tighter text-secondary-container">
                  ₩42,400
                </span>
              </div>
            </div>
            <div className="mb-8 space-y-3">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span className="text-xs leading-tight text-on-surface-variant">
                  주문할 상품의 상품명, 상품가격, 배송정보를 확인하였으며, 구매에 동의하시겠습니까? (전자상거래법 제8조 제2항)
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span className="text-xs leading-tight text-on-surface-variant">
                  개인정보 수집 및 이용 동의 (필수)
                </span>
              </label>
            </div>
            <Link
              href="/orders/complete"
              className="block w-full rounded-xl bg-secondary-container py-5 text-center text-xl font-black text-on-secondary-container shadow-lg shadow-secondary-container/20 transition-all hover:opacity-90 active:scale-[0.98]"
            >
              ₩42,400 결제하기
            </Link>
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
