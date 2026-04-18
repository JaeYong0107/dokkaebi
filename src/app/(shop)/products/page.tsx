import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { ProductCardActions } from "@/components/cart/ProductCardActions";
import { ClickableCardOverlay } from "@/components/shell/ClickableCardOverlay";

const CATEGORIES = [
  { name: "전체보기", count: "1,240", active: true },
  { name: "채소/쌈", count: "432" },
  { name: "과일/견과", count: "128" },
  { name: "정육/계란", count: "256" },
  { name: "수산/해산물", count: "112" },
  { name: "쌀/곡물", count: "89" }
];

const PRODUCTS = [
  {
    id: "prod-lettuce-001",
    eyebrow: "무농약 산지직송",
    name: "국내산 청상추 1kg (박스)",
    priceOriginal: "18,500원",
    priceSale: "12,400원",
    badges: ["사업자 특가"],
    fav: true,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9k_WMHkVAY3hU84kedEpsg-fyvJ-dZfspsobpZ6jphL8mWhIMMQvfDJ7F8ZwbWuWF0t91XxXSj6W8ZCcWEvEarGqmZs-x5wWMHV663NQvQHClODTyJD7kWcfjq3QWc95l14IhYLLACxPVd3lckhHBFzuPZg1tbBEoRx6Vgr1GOi0_yXgtUy2iqVCeytTSjTvuxYkIBtrNeEDNa81ANmidsdQBEAQmUckwEcH48JhRTqzsysBlfji0A5KNNEy8vADO0WLtYy6cnuQ",
    alt: "Fresh Lettuce"
  },
  {
    id: "prod-potato-001",
    eyebrow: "강원도 수미감자",
    name: "수미감자 5kg (특)",
    priceOriginal: "24,000원",
    priceSale: "16,800원",
    badges: ["사업자 특가"],
    best: true,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_0hN-7tFvVxY34y2KYfjjt8O3QRE_NtXXudWoJZfXTjmR8MrEi09ZpJjbQn6NdgN1jW0CZBiBKrElP3WaIXhlxSFOpsOy0ei86UxL55yZVfGxOa4PTDbNoBrwvS0BQv24MlyOVcq7QnW86htmPaoUmrVHdKQXXAYMQhdDZML-fY2QLyrlc0v1v0zB65tHu0Spm3DgPzmhQDT9RHgLpU-UA1m79ikJ3MXlmePu3KBceI8aIV_sTLmUlShcnMLtDxgO7oEJAM917eQ",
    alt: "Fresh Potatoes"
  },
  {
    id: "prod-onion-001",
    eyebrow: "대용량 식자재",
    name: "국산 양파 15kg (대)",
    priceOriginal: "32,000원",
    priceSale: "21,500원",
    badges: ["사업자 특가"],
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFxHQ4wxoL2zQAxKJgNVG-fNQzudULK7AdXgjumFTU_AteYJ5sncoBmkJRKwXIJAQEZsTqYnqHu4b6P_ndZS48zXgrDfbDC9Y-u6CPlwpSaykIYpbEqxjeMiH521tozthpgwPX4tckWnyhKfmQiD9nTLde9MJ0nlevNzpGxIzbgNmZ9CqWJ_tyTgqEBgRKxug86p6YQZHvECr-2KnbzuBE9EvXCxbEs1_XEWcIJm23PlACDDKC2h36Tlq6Xj53TQCXyaxepQqDhxo",
    alt: "Fresh Onions"
  },
  {
    id: "prod-carrot-001",
    eyebrow: "세척 당근",
    name: "제주 흙당근 10kg",
    priceOriginal: "28,000원",
    priceSale: "19,900원",
    badges: ["사업자 특가"],
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDbJuCCnZEdTvpWr19mA_4AwIbV9KrMrhx4L_WtHl4yWzryLXmFBZR_H3Ckc87lKaXaEL1fjKSYwNBZQaIVPVmF6q3gZc7DXTF1kVWzbfzJDeMsN-g9Imt5dobfNdn12QQkT-GyPU7f-QYKV21hhczIuXzNeFwswax96RhCMDSpETgrBaWMr5r1FECymxrhK1yRWYbbu6xU1Au9q73RwtC0FxwMRKeypYYTf8wJPcHm-l6AwLUZ29rj26JRBomLhxGiKOOTvKKckM",
    alt: "Fresh Carrots"
  },
  {
    id: "prod-cucumber-001",
    eyebrow: "선별 오이",
    name: "백오이 50개 (특)",
    priceOriginal: "45,000원",
    priceSale: "34,200원",
    badges: ["사업자 특가"],
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkFryqLf-_qE_UfbUFMPVx9-VmgY2rU4eQL7JKRJ-G50NdkFtn-GC6wYa1WblO0-oVckcj2eBiesj5LHZK5TbA-IQFUH3pxT_Th2cZm502qH48y0fVV2blHAlcH_Wk-a4On26ic0E0Hd3S6BNI7mFbgGSuzvtMxb4qOdtwv_l6pnfMYDEcHaC5YIzENwbYD0QuLYpUD7-y6MpHECaj4sHcuFvpBH3fdjE9p0DzxhUjEl_abGfK1vZ5kl8DhxVaVrgGeFIx6TndJbo",
    alt: "Fresh Cucumbers"
  },
  {
    id: "prod-garlic-001",
    eyebrow: "의성 육쪽마늘",
    name: "깐마늘 1kg (대용량)",
    priceOriginal: "15,000원",
    priceSale: "11,500원",
    badges: ["사업자 특가"],
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-08X7xQXHvZUiWQdYr8mKeD0Lkq1CPiZNT0URob6l4NACWDYsJwdO5yoBMaPs8pE6udyycOOTpUPNUrEGeHziF4Ld7mQUFjLHSluckFqtrxOpvXbYKhisrkjYHo8gy2ZC3aAnyrHPjWJM7GMkXJ0eKTdWHrWxKIVZjIknsT5wvlhKyJ6CIDYgTxBwJ_LaHVHyHaPuAhDLJBPYwzA-BfoywrS1do4ojPWwUkYj8rGu98tT5sSNoGWRewj4TXK01gwRhi0aohEvYsM",
    alt: "Fresh Garlic"
  }
];

const SIDEBAR_BANNER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuARh0b5XDO01H4f1gv5udeCuvCWKqyunxc-siduPyhGK3qGhe9PVtgWDH7C6lFAmdItMqrJ9ByF1yGMteyOBj5b48INviaVXUJpy1U8qJFCP0OCLJfDKHxpR-xQyhlSR2J7S_fDG07RbBxRYnpRRSK-V2iSzV0k5FztVttD6OML2rswKwm50I61sVJuAE_bJ-9gJuFjh4V5eLnvYqDSQH_2kkxptHyQG-AdtmxoGSEERth5FSCnlMAe89V1vysF0Rp54dkUdy2pTMs";

export default function ProductsPage() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12 md:flex-row">
      {/* Left Sidebar: Filters */}
      <aside className="w-full shrink-0 space-y-10 md:w-64">
        <div>
          <h3 className="mb-6 font-headline text-xl font-extrabold tracking-tight">
            카테고리
          </h3>
          <ul className="space-y-3">
            {CATEGORIES.map((category) => (
              <li key={category.name}>
                <Link
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  className={
                    category.active
                      ? "group flex items-center justify-between font-bold text-primary"
                      : "flex items-center justify-between text-on-surface-variant transition-colors hover:text-primary"
                  }
                >
                  <span>{category.name}</span>
                  <span
                    className={
                      category.active
                        ? "text-xs opacity-40 group-hover:opacity-100"
                        : "text-xs opacity-40"
                    }
                  >
                    {category.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6 rounded-[2rem] bg-surface-container-low p-6">
          <h3 className="font-headline text-lg font-bold tracking-tight">
            가격대 필터
          </h3>
          <div className="space-y-4">
            <div className="relative h-1 rounded-full bg-surface-container-highest">
              <div className="absolute inset-y-0 left-1/4 right-1/4 rounded-full bg-primary" />
              <div className="absolute left-1/4 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-primary bg-white shadow-sm" />
              <div className="absolute right-1/4 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-primary bg-white shadow-sm" />
            </div>
            <div className="flex justify-between text-xs font-bold text-on-surface-variant">
              <span>10,000원</span>
              <span>50,000원</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 rounded-md border-outline-variant text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">사업자 전용 할인 상품</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 rounded-md border-outline-variant text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">무료 배송</span>
            </label>
          </div>
        </div>

        <div className="group relative aspect-[3/4] overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SIDEBAR_BANNER}
            alt="Fresh Produce"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/90 to-transparent p-6">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/80">
              Direct Harvest
            </p>
            <h4 className="font-headline text-xl font-extrabold leading-tight text-white">
              산지 직송 채소
              <br />
              새벽 배송 오픈
            </h4>
          </div>
        </div>
      </aside>

      {/* Right Content: Product Grid */}
      <section className="flex-1">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 font-headline text-4xl font-black tracking-tighter text-primary">
              프리미엄 채소/쌈
            </h2>
            <p className="font-medium text-on-surface-variant">
              사장님들을 위한 최상급 퀄리티의 식자재
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm font-bold text-on-surface-variant">
            <button className="border-b-2 border-primary pb-1 text-primary">
              인기순
            </button>
            <button className="border-b-2 border-transparent pb-1 transition-colors hover:text-primary">
              낮은 가격순
            </button>
            <button className="border-b-2 border-transparent pb-1 transition-colors hover:text-primary">
              신선도순
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <article key={product.id} className="group relative">
              <ClickableCardOverlay
                href={`/products/${product.id}`}
                label={`${product.name} 상세 보기`}
              />
              <div className="relative z-0 mb-6 aspect-square overflow-hidden rounded-[2.5rem] bg-surface-container-low">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.img}
                  alt={product.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4">
                  {product.badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full bg-tertiary px-3 py-1 text-[10px] font-black tracking-tighter text-white shadow-lg"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                {product.best && (
                  <div className="absolute right-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black tracking-tighter text-white">
                    BEST
                  </div>
                )}
              </div>
              {product.fav && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-[8.5rem] right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-primary shadow-xl backdrop-blur"
                >
                  <Icon name="favorite" />
                </span>
              )}
              <div className="relative z-20 space-y-1 px-2">
                <p className="text-xs font-bold text-stone-400">
                  {product.eyebrow}
                </p>
                <h3 className="truncate font-headline text-lg font-bold text-on-surface transition-colors group-hover:text-primary">
                  {product.name}
                </h3>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-sm text-stone-400 line-through">
                    {product.priceOriginal}
                  </span>
                  <span className="font-headline text-xl font-extrabold text-primary">
                    {product.priceSale}
                  </span>
                </div>
                <div className="relative z-20">
                  <ProductCardActions productId={product.id} />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-20 flex justify-center">
          <button className="group flex items-center gap-4 rounded-full border border-stone-100 bg-white px-8 py-4 shadow-sm transition-all hover:border-primary">
            <span className="font-bold text-on-surface">상품 더보기 (12 / 432)</span>
            <Icon
              name="expand_more"
              className="text-primary transition-transform group-hover:translate-y-1"
            />
          </button>
        </div>
      </section>
    </main>
  );
}
