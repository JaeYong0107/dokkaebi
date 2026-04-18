import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { formatCurrency } from "@/lib/format";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBMD8lMaQWMvoc_tkSG9OmmV9AK0ZbxlkhmSUOkiz_nWfPt3ed9x_PdDqL9ygAuUuSHrJFynVU6hpFecCUjdWIjcJxnjIyPtaryFDlH3iuftnSTJ0WU9fOgCYjNR_XAZ2-A3n08eT6I5dsYwNV55oc8rKpXS1gphRxLqXRsGhgSAKVxUak5FFQgfOgUTkR1iKmRcmoNnLsEthJ1MZYpj6YHWS8GWmBaW40ISZqdaNQM8vzO6oXA-Dt81VhB0xy7sYqFzLBgEpO6kzc";

const QUICK_REORDER = [
  {
    name: "햇감자 10kg (국내산)",
    meta: "24,500원 · 2박스",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYbFj1k1HH8zfi9YPVuycW2gWCNP6s0TTf-VNLbBJ163Mqdzi6WsWUvJO0mwkNrnp_MaSQNXN-f9oZGMsem_RTyShMhVvOZx1Kz6NU1UNdGp5_ZygsA-8juj7HbPxrcBb86NmDteNSJVxNhJHRzjyv5k0iHxKfvQeydtwZLkVXcpDzF5K9GhupcFZGQHaOjFGouWesE9s4KlZc3S_y7NubvzepxzSe_MpZb9AANk2O6myVTM8H-cBNNb1F0A0UiMKWmg9M-HTeAgc",
    alt: "햇감자"
  },
  {
    name: "깐대파 1kg (특상)",
    meta: "4,200원 · 5팩",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWvKOcN9pEQ83SC6sr_cyLoAB4qEzY9lD_W6IeihDO3__X3a2rkAYVgrox0QAiEnIiED75GvyS6YNTGSRZWHBsKvPtJlt69aXHVfpYsHvA_7azmt-wrg1NQ8FY0uWKgFeprBrn53IkZ5X_tOR8apoVIwfS1ylZ7ia-yUNpUUMrhgqjK-tRMKLuYUefHKQqpsy76-D-xZceQpkhwDoAjUz3i1OOf0b261ScSLmtyK8fDU8ZqYx0FSCIF-kWeTFpkaOKNv6qLOFYcTY",
    alt: "깐대파"
  },
  {
    name: "흙당근 5kg",
    meta: "12,000원 · 1박스",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJboTHgeDs_2oOeuPFZWPA2KH4tKU88ULAxMDr9shGJEhLD215GJU9quElXm4rwrmrbH7GgHaDjQpUyL3jbMR_h-GHmySfXQGBU950Hyd060aaQBGwc5BS2G9TuO8vmRQLeZYGap4Q8hOTe2WVERHkmy5-M7KWR3Zi_JejOzEzfArsN5E_yPzJIhDYeyWsr9tUSqta-dTlqSqRN2saT6vqCIOf1KUh-7CT_cKkr5j_8DHWepU8UV38WZuLQlkdgjWF37g-RxtyExU",
    alt: "흙당근"
  }
];

const POPULAR_PRODUCTS = [
  {
    id: "prod-carrot-001",
    category: "채소/야채",
    name: "신선 특당근 10kg",
    price: 21800,
    badge: { label: "BEST", tone: "bg-secondary-container text-on-secondary-container" },
    extra: { label: "B2B 할인", tone: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAD3_bLeOHLZKpHNQTEHtVEUtK_NXew-E12Wrg7RagVazg9GEXfoSwQEeiHTtQwWH8AP3NAjqMMH_z1mw0MbQqeHTb2RgeeSlHKsyjg-Dsk0ifZJA6j90tRkKDRZ7Wy8ipVb07li_3EYvKwGeJeN8dfWRibcWyA4EEHHIXwJ2F2jBqo_6FkGR_u_djIQWdbvxf34nM2GzuLBbeO75xfcu37Jvqm4u5fAdx2rb_NZ65PGCKS3v0c4fYkf9wMky7Lxf0TOb6J6XSwIOQ"
  },
  {
    id: "prod-broccoli-001",
    category: "채소/야채",
    name: "친환경 브로콜리 2입",
    price: 4900,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcwS92TEeDYpNW7eH3OxetSfXLwggPiQV4s2qWGpkngICTP_dTgOQDRy56VZXWztj0eVenRVSuSEik9iPfwCCMmkOcFBUX1H34Yt8YIYYhjLYkvsNgoG8spRcipvCCzAsdj-o5HdHYlZYZnMOUmVkDRQo2MxQP8GUH5j8lPTvVLKjuM9zNqpuJCxr2LgmnyZm7kBwwRhTetK0lpIzRsfruY7jAdw_Leeg49a3tpGnN-GFJZFcFLfGdoQAW_f0qhFV4BZcblvfpLC8"
  },
  {
    id: "prod-garlic-001",
    category: "양념/조미료",
    name: "의성 깐마늘 1kg (대)",
    price: 13200,
    badge: { label: "신선보장", tone: "bg-primary-container text-on-primary-container" },
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUFgN-BXmNZhidLoJwU8PWDCfXyD1ngT8ULhclbT3MRFQQ_FzOfWrqOo4PJb2kwp4FWJ9PC0LZySTLKATfmh4OcypnfnN3bAVhNm7zcF7_BtnU2IwzHuxS7yk7m8q6YFcS6xcAF-nymECkwtTv7pbpFivtKrr68Mrk-nQefBx6woAeOpgUhf1gql6rSZ-izKAZkxSM_G6pWk8Bcd_tYB2s5rOPnaAxy0icdV_Lyg3qFZQ9Zd-ideMI9DC3iK0eAB02DrRSLQQv8yk"
  },
  {
    id: "prod-onion-001",
    category: "채소/야채",
    name: "햇양파 5kg (대)",
    price: 9800,
    extra: { label: "품절임박", tone: "bg-secondary-fixed text-on-secondary-fixed-variant" },
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnu3bLwfGd0QxqByRy-V4Z4i8d9LkTAfv44mlL1fMssdjbOMYWXd5maDYafm8kNR-cvagHxLGCSCZReQhDCM1HPr-dM-rzFpYJRxI-e17C418wBRxMg3Sdvkke06Z36UA3JfXUmzHOVX9M7K2w4xG1FQsWGu15d4db-_tEFxQlyw2VUMDpd9mIFKwUio1InOglZHrtjdH-EG0y3RtBRvjK0-1bkOmRFONmv0OImmIXx5XWTIZxJUfC_44B1eY-U6pAvxdxu5YH1ZE"
  },
  {
    id: "prod-pineapple-001",
    category: "과일",
    name: "골드파인애플 1수",
    price: 7500,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7C3bAtvBksx7yEXBwOGZ4M2q4HNVqQCLM2iqGW8XDdsMsxWqBUxDiz-HrzGdrLE_QJCkZb52I41q9SdJ2XOn8uH8--FuaEukudTZYivSnwtK3lGiLSEu153341Fql6-lkNA2QJt7fiGN822uDmcl90-i9HPMdZF-Ok_TvuY2aCgTVpJbyouYRT78jrbLWdn83ViPjgkRRxYVO6__-kYLQ7DHsjUDFtMvwmNeoNBTxZLenAjGj5jOI2VN0PR0Yi0lhw1ByXQaFEJ8"
  }
];

const CATEGORIES = [
  { name: "채소", icon: "energy_savings_leaf" },
  { name: "과일", icon: "nutrition" },
  { name: "곡류", icon: "flatware" },
  { name: "수산", icon: "set_meal" },
  { name: "축산", icon: "lunch_dining" },
  { name: "식자재", icon: "restaurant" },
  { name: "계란/유제품", icon: "egg" },
  { name: "음료/주류", icon: "liquor" },
  { name: "기타", icon: "grid_view" }
];

const QUICK_REORDER_TOTAL = 44900;

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6">
      {/* Hero Section & Quick Reorder (Bento Style) */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Left: Hero Banner */}
        <div className="group relative flex h-[400px] items-center overflow-hidden rounded-[2rem] bg-primary p-12 md:col-span-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMAGE}
            alt="신선한 농산물"
            className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
          />
          <div className="relative z-10 max-w-lg">
            <span className="mb-4 inline-block rounded-full bg-secondary-container px-4 py-1.5 text-xs font-bold text-on-secondary-container">
              B2B EXCLUSIVE
            </span>
            <h1 className="mb-6 font-headline text-5xl font-extrabold leading-[1.1] tracking-tighter text-white">
              새벽에 수확한
              <br />
              신선함을 식탁까지.
            </h1>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-4 font-bold text-on-secondary transition-all hover:brightness-110 active:scale-95"
            >
              지금 쇼핑하기
              <Icon name="trending_flat" />
            </Link>
          </div>
        </div>

        {/* Right: Quick Reorder Widget */}
        <div className="flex flex-col justify-between rounded-[2rem] bg-surface-container-lowest p-8 shadow-ambient md:col-span-4">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-headline text-xl font-bold tracking-tight">
                최근 주문 다시 보기
              </h2>
              <Icon name="history" className="text-stone-400" />
            </div>
            <div className="mb-8 space-y-4">
              {QUICK_REORDER.map((item) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-xl bg-surface-container-low">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.img}
                      alt={item.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-stone-500">{item.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1 text-sm font-medium">
              <span className="text-stone-500">총 {QUICK_REORDER.length}개 품목</span>
              <span className="font-bold text-primary">
                {formatCurrency(QUICK_REORDER_TOTAL)}
              </span>
            </div>
            <Link
              href="/reorder"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-4 font-bold text-on-secondary shadow-lg shadow-secondary/20 transition-all hover:brightness-110 active:scale-95"
            >
              <Icon name="shopping_cart_checkout" />
              전체 다시 담기
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Section */}
      <section className="mb-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="mb-2 font-headline text-3xl font-extrabold tracking-tight">
              실시간 인기 상품
            </h2>
            <p className="text-sm text-stone-500">
              지금 가장 많이 주문되고 있는 품목입니다.
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-bold text-stone-400 transition-colors hover:text-primary"
          >
            전체보기
            <Icon name="chevron_right" className="text-[18px]" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
          {POPULAR_PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="group rounded-[1.5rem] bg-surface-container-lowest p-4 transition-all hover:shadow-xl hover:shadow-stone-200/50"
            >
              <Link
                href={`/products/${product.id}`}
                className="relative mb-4 block aspect-square overflow-hidden rounded-xl bg-surface-container-low"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.img}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.badge && (
                  <div
                    className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-bold ${product.badge.tone}`}
                  >
                    {product.badge.label}
                  </div>
                )}
              </Link>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                {product.category}
              </p>
              <Link
                href={`/products/${product.id}`}
                className="mb-2 block line-clamp-1 text-sm font-bold text-on-surface transition-colors hover:text-primary"
              >
                {product.name}
              </Link>
              <div className="mb-3 flex items-center gap-2">
                <span className="font-headline text-lg font-extrabold tracking-tight text-primary">
                  {formatCurrency(product.price)}
                </span>
                {product.extra && (
                  <div
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${product.extra.tone}`}
                  >
                    {product.extra.label}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="w-full rounded-full border border-stone-100 py-2.5 text-xs font-bold transition-all hover:bg-stone-50 active:scale-95"
              >
                담기
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Categories Shortcut */}
      <section className="mb-20">
        <h2 className="mb-8 font-headline text-xl font-bold tracking-tight">
          카테고리별 쇼핑
        </h2>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-9">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href="/products"
              className="group flex cursor-pointer flex-col items-center gap-3"
            >
              <div className="flex aspect-square w-full items-center justify-center rounded-[1.5rem] bg-stone-100 transition-all group-hover:bg-primary-container group-hover:text-on-primary-container">
                <Icon name={category.icon} className="text-3xl" />
              </div>
              <span className="text-xs font-bold">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter / Business Trust */}
      <section className="mb-16 flex flex-col items-center justify-between gap-8 rounded-[2rem] bg-surface-container-highest p-12 md:flex-row">
        <div className="max-w-xl text-center md:text-left">
          <h2 className="mb-4 font-headline text-2xl font-extrabold tracking-tight">
            대량 주문 및 정기 배송 안내
          </h2>
          <p className="text-stone-600">
            사업자 회원님을 위한 최저가 제안과 전담 매니저 매칭 서비스를 받아보세요.
            깐깐하게 검수된 최상급 식재료만 약속합니다.
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
          <button className="rounded-full bg-primary px-8 py-4 font-bold text-on-primary transition-all active:scale-95">
            상담 신청하기
          </button>
          <button className="rounded-full border border-stone-200 bg-surface-container-lowest px-8 py-4 font-bold text-on-surface transition-all active:scale-95">
            단가표 다운로드
          </button>
        </div>
      </section>
    </main>
  );
}
