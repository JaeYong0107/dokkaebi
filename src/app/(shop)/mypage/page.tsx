import { Icon } from "@/components/common/Icon";

const FREQUENTLY_BOUGHT = [
  {
    eyebrow: "유기농 인증",
    name: "친환경 어린잎 채소 500g",
    price: "8,900원",
    priceOriginal: "10,200원",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvxkb5RTyM3qoqgV3g3nl3Dm3BD1ID64Mx508UsS3RZu7vsB8uIiPrLJqaL0Qevfaq-G9eaQpSPtmJ-dR3ANLJz4lCHLeJHi8j8vjYZOubS6U6LCjWFZhvnDNqyHZiUenwmjZpJBnzaofuYzDRwDnufmFNN3roW4Z4atQ_DaRurWFRB_1vp4ZOv-zdrpK0Gziowubdd3QwaYEVEGEIDBEJfbT5qBQwlR1Wig6bI3kg4p2EZ7wqSbyGSFD6ifFP5_JYEFpkjgWJQwU",
    alt: "Spinach"
  },
  {
    eyebrow: "베스트셀러",
    name: "제주 흙당근 1kg (특상)",
    price: "4,500원",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBwCQO2Ti8o4ForqNWfN1Pb5LVhr1wDkl1En8vIB9rywq0ieqoqKED86PkX-egSO4Doi99v8rx5QoR_0Ia78g9D9-c-mJDV7g6NNxT6ZXEpeKek9TQHnzn4f3xKJZtLsjg_Zhu8SBjz6Cbh7siiaxhohSVJIrf_7MQsCwLygcW26ayqNgJ8o_HCqnnpy6vlYJnInApuc2dtrscy5IXaOmSf4w2H-WSYt6ZGz2-m7ql3t_yq_cIySELv7j-TmUIuHhYCabW0HA7mvw",
    alt: "Carrots"
  }
];

const RECENT_ORDERS = [
  {
    date: "2024.05.12",
    orderNumber: "240512-00912",
    title: "무항생제 한우 1등급 외 5건",
    status: "배송완료 · 124,500원",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmxeNQmq3aGXGfICoCa9Bqb6ZH9Cn17xGH-9-onxrx05o-XEbJqVz1N-EEXgwiNXJghCWwCD5VL9KkOYE37P6aCt4pzkSIWe7SdUF09hpA3rxfptIkM25CvdcN-YDtx8rnoS3COOo-5GYasWkkdiWhJ3RHscUw2Mkmmy41jwyyEBJ_xA2wCmRuc5elaJjhsGdOrztSl6xIu3GIg9tbBHt-COwXoiZ-e790F5yfxJkMSyxUV0DgNNu_dRqNylE5njHoI7gqiH4nauw",
    extras: 4,
    primary: true
  },
  {
    date: "2024.04.28",
    orderNumber: "240428-00456",
    title: "신선 아스파라거스 250g 1팩",
    status: "배송완료 · 6,800원",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbdYMm-uSY17Ii839QWjtGxzqjW1vu-4dqlOZu7CYFhaq-1M2gcQX0xI_1RJsXdrSLocFpIGRSXtYygVlVrLCAWaiuIopzrxQVW7KqICaIcvhALagt_3ybSWKs5IaU0NIVDAalw1J9YSFUt5QmFgZqO9eYCD8DA772zVsUqfGzLV6z8zlz1FjVzZ5qEkztoI8Y7sxz__vF_dmD4N9noxI4BW0uc6F0acVOld8DFByDJGehfnyF9EHLn9719Qg0HBUUTlBspJYekzY",
    extras: 0,
    primary: false
  }
];

const QUICK_REORDER = [
  { name: "우유 (900ml)" },
  { name: "달걀 (20구)" },
  { name: "두부 (300g)" }
];

const SIDEBAR_LINKS = [
  { icon: "favorite", label: "찜한 상품" },
  { icon: "reviews", label: "상품 후기" },
  { icon: "location_on", label: "배송지 관리" },
  { icon: "credit_card", label: "결제 수단" }
];

export default function MyPage() {
  return (
    <main className="mx-auto flex max-w-screen-2xl flex-col gap-10 px-8 py-10 pb-32">
      {/* Profile & Grade Section */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* User Info Card */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border-none bg-surface-container-lowest p-8 shadow-sm md:col-span-4">
          <div className="absolute -mr-16 -mt-16 right-0 top-0 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
          <div>
            <span className="mb-2 block font-headline text-lg font-bold tracking-tight text-primary">
              DOKKAEBI GARDENER
            </span>
            <h1 className="mb-4 font-headline text-4xl font-extrabold text-on-surface">
              김도깨비 <span className="text-primary">님</span>
            </h1>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-container px-3 py-1 text-sm font-bold text-white">
              <Icon name="stars" className="text-sm" />
              <span>최고 등급: 하이 가드너</span>
            </div>
          </div>
          <div className="mt-8">
            <button className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              회원정보 수정 <Icon name="arrow_forward_ios" className="text-xs" />
            </button>
          </div>
        </div>

        {/* Stats Bento Cards */}
        <div className="grid grid-cols-2 gap-4 md:col-span-8 lg:grid-cols-4">
          <KpiCard label="보유 쿠폰" value="12" suffix="장" />
          <KpiCard label="적립금" value="45,200" suffix="원" />
          <KpiCard label="진행중인 주문" value="3" suffix="건" />
          <div className="flex flex-col items-start justify-between rounded-xl bg-primary-container p-6 text-white">
            <span className="text-sm font-medium text-white/80">1:1 문의 내역</span>
            <div className="mt-2 flex w-full items-end justify-between">
              <p className="font-headline text-3xl font-black">
                0<span className="ml-1 text-lg font-bold">건</span>
              </p>
              <button className="rounded-full bg-white/20 p-2 backdrop-blur-md hover:bg-white/30">
                <Icon name="chat_bubble" className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Business Conversion Banner */}
      <section className="relative flex flex-col items-center justify-between overflow-hidden rounded-xl bg-on-surface p-8 text-white md:flex-row">
        <div className="z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary-fixed">
            <Icon name="business_center" />
            <span className="text-xs font-bold uppercase tracking-widest">
              B2B Membership
            </span>
          </div>
          <h2 className="font-headline text-2xl font-bold">
            사업자 전용 혜택을 놓치지 마세요
          </h2>
          <p className="text-sm opacity-80">
            대량 구매 할인, 정기 배송 및 세금 계산서 발행 자동화
          </p>
        </div>
        <div className="z-10 mt-6 md:mt-0">
          <button className="rounded-full bg-primary px-8 py-3 font-bold text-white transition-all hover:bg-primary-container active:scale-95">
            사업자 인증하기
          </button>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-primary/20" />
      </section>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left: Frequently Bought + Recent Orders */}
        <div className="flex flex-col gap-10 lg:col-span-2">
          {/* Frequently Bought */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-headline text-xl font-extrabold">
                <Icon name="recycling" className="text-primary" />
                자주 사는 상품
              </h3>
              <button className="text-sm font-bold text-on-surface-variant transition-colors hover:text-primary">
                전체보기
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {FREQUENTLY_BOUGHT.map((p) => (
                <article
                  key={p.name}
                  className="group flex items-center gap-4 rounded-xl bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high"
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.img}
                      alt={p.alt}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex h-full flex-grow flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">
                        {p.eyebrow}
                      </span>
                      <h4 className="line-clamp-1 font-bold text-on-surface">
                        {p.name}
                      </h4>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="font-headline text-lg font-black text-primary">
                          {p.price}
                        </span>
                        {p.priceOriginal && (
                          <span className="text-xs italic text-on-surface-variant line-through">
                            {p.priceOriginal}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="mt-2 flex w-max items-center justify-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-primary-container active:scale-90">
                      <Icon name="shopping_basket" className="text-sm" />
                      재주문
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Recent Orders */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-headline text-xl font-extrabold">
                <Icon name="local_shipping" className="text-primary" />
                최근 주문 내역
              </h3>
            </div>
            <div className="flex flex-col gap-6">
              {RECENT_ORDERS.map((order) => (
                <article
                  key={order.orderNumber}
                  className={
                    "overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm" +
                    (order.primary ? "" : " opacity-80 grayscale-[0.3]")
                  }
                >
                  <div className="flex items-center justify-between bg-surface-container-high px-6 py-3">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-bold">{order.date}</span>
                      <span className="text-on-surface-variant">
                        주문번호: {order.orderNumber}
                      </span>
                    </div>
                    <button className="flex items-center gap-1 text-xs font-bold text-primary">
                      주문상세보기
                      <Icon name="arrow_forward" className="text-[10px]" />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="flex -space-x-4">
                        <div className="h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-surface">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={order.img}
                            alt={order.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {order.extras > 0 && (
                          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-surface-container">
                            <span className="text-xs font-bold">+{order.extras}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h5 className="text-lg font-bold">{order.title}</h5>
                        <p className="text-sm font-medium text-on-surface-variant">
                          {order.status}
                        </p>
                      </div>
                      <button
                        className={
                          "flex items-center gap-2 rounded-full px-6 py-3 font-bold transition-all" +
                          (order.primary
                            ? " bg-secondary-container text-white hover:opacity-90 active:scale-95"
                            : " bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high")
                        }
                      >
                        <Icon name="add_shopping_cart" />
                        전체 다시 담기
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Quick Reorder Bar */}
          <div className="rounded-2xl border border-white/20 bg-surface-bright/80 p-6 shadow-xl backdrop-blur-2xl">
            <h4 className="mb-4 flex items-center gap-2 font-headline font-bold">
              <Icon name="bolt" filled className="text-primary" />
              빠른 재주문 바
            </h4>
            <div className="flex flex-col gap-3">
              {QUICK_REORDER.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg bg-white p-3"
                >
                  <span className="text-sm font-medium">{item.name}</span>
                  <button className="rounded-md bg-primary-fixed p-1 text-primary">
                    <Icon name="add" className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Menu */}
          <div className="flex flex-col gap-2 rounded-2xl bg-surface-container p-4">
            {SIDEBAR_LINKS.map((link) => (
              <a
                key={link.label}
                href="#"
                className="group flex items-center justify-between rounded-xl p-4 transition-all hover:bg-white"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    name={link.icon}
                    className="text-on-surface-variant transition-colors group-hover:text-primary"
                  />
                  <span className="font-bold">{link.label}</span>
                </div>
                <Icon
                  name="chevron_right"
                  className="text-sm text-on-surface-variant"
                />
              </a>
            ))}
          </div>

          {/* 1:1 Inquiry */}
          <button className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-on-surface p-5 font-bold text-white transition-all hover:bg-primary active:scale-95">
            <Icon
              name="support_agent"
              className="transition-transform group-hover:rotate-12"
            />
            1:1 문의하기
          </button>
        </div>
      </div>
    </main>
  );
}

function KpiCard({
  label,
  value,
  suffix
}: Readonly<{
  label: string;
  value: string;
  suffix: string;
}>) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-surface-container p-6 transition-colors hover:bg-surface-container-high">
      <span className="text-sm font-medium text-on-surface-variant">{label}</span>
      <p className="mt-2 font-headline text-3xl font-black text-primary">
        {value}
        <span className="ml-1 text-lg font-bold">{suffix}</span>
      </p>
    </div>
  );
}
