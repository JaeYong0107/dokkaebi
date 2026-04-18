import Link from "next/link";
import { Icon } from "@/components/common/Icon";

const CART_ITEMS = [
  {
    id: "scallion",
    eyebrow: "국산 / 유기농",
    name: "[도매] 산지직송 흙대파 10kg (1단)",
    sku: "SKU: DKB-VG-042",
    quantity: 2,
    priceOriginal: "48,000원",
    priceSale: "42,500원",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn0qRKX1Nag5_VR3rFNjYv9AEkxv7YtUWiHg3NTA3nzhjS0WrxbUTzlyNU5MHf4aCFo97WK9xqn4-J2GVMd7QYS0K9GWNB47umI8Nb3EDLEkt6c9FCk-_uctiyaI0pm0dPDtvLLwK3puLqcZwJiL9_LTBM45BwKAevmt9aKxcfOSxj4GFKMn2kw-OyP9mQEmtd4EN8wZ5jTGY8B4_KJpQZysir6JT_Qudzj__xqXye_yOLTeYfEPdUpL9sb1ZE9mpaAG5hHgvWWb0",
    alt: "Green onions"
  },
  {
    id: "carrot",
    eyebrow: "국산 / 세척",
    name: "[도매] 제주 세척당근 5kg 박스",
    sku: "SKU: DKB-VG-118",
    quantity: 1,
    priceSale: "12,800원",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxLCU18J_9OIawgXb6PRJYfSE91fvSVp1KMdPRHXdskQrfBOdul9oUo60OK1dElpPKRHFZuTw6LQR946TtvVWulskcr-yYYh-boSbrx3CgZVAhMckGW35WYp01KEwmBjiHF7yV0TSR1zNBUBHS9j4mMlq8yZxUQ3Ku1kIaJLzt9cG61h7BFpMz3kZR698Qf6urZAweVaRG7wDd9e625x_cXx4td7Ayq2eIXTlqnFpVv0ghs05CUVwC_vSbnPhAlTP9nZAnkMTkTD0",
    alt: "Carrots"
  }
];

const RECOMMENDATIONS = [
  {
    region: "경상남도 창녕",
    name: "깐마늘 1kg (업소용)",
    price: "9,400원",
    badge: "베스트",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7WBX3sfkBRLz4iCLsP0AMMc-lfnEZzsRxRR1vCGuqaLEHF5iGfSomSjO_RNjmUycA26zULfRS_J6GULbI2YiIrKbGDDo2YYZRGY_fjmv-Fyr5-OAkwqTCqJIyMwiUllAcugXlH_TfEWWwRJltUD1GAYjj-PEL5YCa_PMTd11azQwhUHqu3Pcxbi5eQ8zpbSeRL9F2h5aohe5oCkGMioynkpUSgM3jny4tlB32QqhBsDOEuC-NOn1T7-AjMDCCHkh0Q_9ZZzVSi9k",
    alt: "Garlic"
  },
  {
    region: "전라남도 무안",
    name: "청양고추 2kg (박스)",
    price: "15,900원",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdVnkQb5FHKX2ffnSSguNtaYxHbjY_scwqF0vFSUSzXpL7ayzUb9xoCzkkikc1H3dwn4gAsHfq23DvjNuLG6pZjXemK4Pe4jy4OTYWpET2vXbXDIMKHgvxeIjQ_aeLEjq2Hs7uW6KcHgVbaTCsP5c9NKIXGQpWCrslNAiuL2IQFz-U8RNCYor6dU6rW7LSZDj97B65wBWm6YPVVxD1kqMHjzN32RtQwc9XpqPt700RWF0I-Xuus1UM9Jz2Swvvc6OLNavfwinF8pA",
    alt: "Chili peppers"
  },
  {
    region: "전라남도 무안",
    name: "무안 햇양파 15kg (대망)",
    price: "21,000원",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuAaBVTjQk5GOTtQwedoN1jRZQppb4SL1HuyCOd2BM3lQ6a_MofuKKfitLjsXwbsYOhpeSBZD2P2ydJ6ZsL0gJ7E8sYRellm1gE-DVO6pAk4e2DwAzX7q9IGnvcA7jioZ8wCfgnsYaxSWL5swBnXge6GFKvyeQBv7B8v_CvWYuwV1i6tzdMMxqd3l2SBH67xUIlpLx_gAEOGruuRml17kLHZ35tIFpK5bQ0zaZngSGoSZBefZxjh37q_djnZ28h9E3b7l6Hba8nNY",
    alt: "Yellow onions"
  },
  {
    region: "강원도 고랭지",
    name: "양배추 3망 (업소용)",
    price: "11,200원",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDWrfRaIBaqdRqhzuuIs6zWly7s_j6LRkOFx0PHvBxLbTC6223iXS3jSPA1u8kEd7IhoGHuhgUlDUL9wGI_XIf6SMCFDqr1HCScUDuwbQicDVRW_YgEm1opv84fta0zS8BwvXEgMr_zJBecvqs9QBYNoxL_xKJuWc8-97z3zC69MBsCLZxMEys1YPP8xUNijr5xR1nSHqnEasQH_ryxA2Z-6tMpETJZ08-9gf-6ul4M6q6-09c6QqowB9tQ_-r6ChML5RMS50wQDg",
    alt: "Cabbage"
  }
];

export default function CartPage() {
  return (
    <main className="mx-auto max-w-screen-2xl px-8 pb-24 pt-10">
      <div className="mb-8 flex items-baseline">
        <h1 className="mr-4 font-headline text-4xl font-black tracking-tight text-primary">
          장바구니
        </h1>
        <span className="font-medium text-on-surface-variant">
          총 3개의 상품이 담겨있습니다.
        </span>
      </div>
      <div className="grid grid-cols-12 items-start gap-8">
        {/* Cart Items */}
        <div className="col-span-12 space-y-4 lg:col-span-8">
          {CART_ITEMS.map((item) => (
            <article
              key={item.id}
              className="group flex items-center gap-6 rounded-xl bg-surface-container-lowest p-6 transition-all duration-300"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.img}
                  alt={item.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-grow flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-primary">
                    {item.eyebrow}
                  </span>
                  <h3 className="font-headline text-lg font-bold leading-tight">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {item.sku}
                  </p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex items-center rounded-full bg-surface-container-high px-2 py-1">
                    <button className="flex h-8 w-8 items-center justify-center font-bold text-primary">
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button className="flex h-8 w-8 items-center justify-center font-bold text-primary">
                      +
                    </button>
                  </div>
                  <div className="min-w-[100px] text-right">
                    {item.priceOriginal && (
                      <p className="text-sm text-on-surface-variant line-through">
                        {item.priceOriginal}
                      </p>
                    )}
                    <p className="font-headline text-xl font-extrabold text-primary">
                      {item.priceSale}
                    </p>
                  </div>
                  <button className="text-on-surface-variant/40 transition-colors hover:text-error">
                    <Icon name="close" />
                  </button>
                </div>
              </div>
            </article>
          ))}
          <button className="group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/30 py-10 text-on-surface-variant/60 transition-all hover:border-primary/30 hover:bg-surface-container-low">
            <Icon
              name="add_circle"
              className="mb-2 text-3xl transition-transform group-hover:scale-110"
            />
            <span className="text-sm font-bold">식재료 더 담기</span>
          </button>
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
                  최소 주문 금액 (50,000원)
                </span>
                <span className="text-xs font-bold italic text-primary">
                  달성 완료!
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div className="h-full w-full bg-gradient-to-r from-primary to-primary-container" />
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-on-surface-variant">
                <span className="font-bold text-primary">사업자 회원님,</span> 현재 무료 배송 조건 및 최소 주문 금액을 충족하셨습니다.
              </p>
            </div>
            <div className="mb-8 space-y-4 border-b border-outline-variant/20 pb-6 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">총 상품 금액</span>
                <span className="font-bold">55,300원</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">상품 할인</span>
                <span className="font-bold text-error">-5,500원</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-on-surface-variant">배송비</span>
                  <span className="rounded bg-primary-fixed px-1.5 py-0.5 text-[10px] font-bold text-on-primary-fixed">
                    사업자
                  </span>
                </div>
                <span className="font-bold text-primary">0원</span>
              </div>
            </div>
            <div className="mb-8 flex items-end justify-between">
              <span className="text-lg font-bold">예상 결제 금액</span>
              <span className="font-headline text-4xl font-extrabold tracking-tighter text-primary">
                49,800원
              </span>
            </div>
            <Link
              href="/checkout"
              className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl bg-secondary-container py-5 font-headline text-xl font-black text-on-secondary-container shadow-lg shadow-secondary/10 transition-all hover:opacity-90 active:scale-95"
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
          <button className="flex items-center gap-1 text-sm font-bold text-primary">
            전체보기 <Icon name="open_in_new" className="text-sm" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {RECOMMENDATIONS.map((rec) => (
            <article
              key={rec.name}
              className="group overflow-hidden rounded-2xl bg-surface-container-low"
            >
              <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rec.img}
                  alt={rec.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-2 right-2">
                  <button className="rounded-full bg-primary p-2 text-white shadow-lg transition-transform hover:scale-110">
                    <Icon name="add_shopping_cart" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <p className="mb-1 text-[10px] font-bold text-on-surface-variant">
                  {rec.region}
                </p>
                <h3 className="mb-3 text-sm font-bold">{rec.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-headline text-lg font-extrabold">
                    {rec.price}
                  </span>
                  {rec.badge && (
                    <span className="rounded bg-primary-fixed px-1.5 text-[10px] font-bold text-primary">
                      {rec.badge}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
