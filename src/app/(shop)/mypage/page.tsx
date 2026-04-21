import Link from "next/link";
import { serverFetch } from "@/shared/lib/api/server-fetch";
import { formatCurrency } from "@/shared/lib/format";
import { Icon } from "@/shared/ui/Icon";

type MyPageResponse = {
  profile: {
    nickname: string;
    gradeTitle: string;
    gradeLabel: string;
  };
  stats: {
    coupons: number;
    points: number;
    progressingOrders: number;
    inquiries: number;
  };
  businessBanner: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
  };
  sidebarLinks: Array<{
    icon: string;
    label: string;
    href: string;
  }>;
  labels: {
    editProfile: string;
    frequentlyBoughtTitle: string;
    recentOrdersTitle: string;
    quickReorderTitle: string;
    inquiryCta: string;
    reorderCta: string;
    viewAll: string;
    viewOrderDetail: string;
    reorderAll: string;
  };
  frequentlyBought: Array<{
    productId: string;
    eyebrow: string;
    name: string;
    price: number;
    priceOriginal: number;
    imageUrl?: string;
  }>;
  recentOrders: Array<{
    id: string;
    date: string;
    orderNumber: string;
    title: string;
    status: string;
    imageUrl?: string;
    extras: number;
    primary: boolean;
  }>;
  quickReorder: Array<{
    productId: string;
    name: string;
  }>;
};

export default async function MyPage() {
  const response = await serverFetch("/api/mypage");
  const data = (await response.json()) as MyPageResponse;

  return (
    <main className="mx-auto flex max-w-screen-2xl flex-col gap-10 px-8 py-10 pb-32">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border-none bg-surface-container-lowest p-8 shadow-sm md:col-span-4">
          <div className="absolute -mr-16 -mt-16 right-0 top-0 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
          <div>
            <span className="mb-2 block font-headline text-lg font-bold tracking-tight text-primary">
              {data.profile.gradeTitle}
            </span>
            <h1 className="mb-4 font-headline text-4xl font-extrabold text-on-surface">
              {data.profile.nickname} <span className="text-primary">님</span>
            </h1>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-container px-3 py-1 text-sm font-bold text-white">
              <Icon name="stars" className="text-sm" />
              <span>{data.profile.gradeLabel}</span>
            </div>
          </div>
          <div className="mt-8">
            <button className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              {data.labels.editProfile}
              <Icon name="arrow_forward_ios" className="text-xs" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:col-span-8 lg:grid-cols-4">
          <KpiCard
            label="보유 쿠폰"
            value={String(data.stats.coupons)}
            suffix="장"
          />
          <KpiCard
            label="적립금"
            value={formatCurrency(data.stats.points).replace("₩", "")}
            suffix="원"
          />
          <KpiCard
            label="진행중인 주문"
            value={String(data.stats.progressingOrders)}
            suffix="건"
          />
          <div className="flex flex-col items-start justify-between rounded-xl bg-primary-container p-6 text-white">
            <span className="text-sm font-medium text-white/80">1:1 문의 내역</span>
            <div className="mt-2 flex w-full items-end justify-between">
              <p className="font-headline text-3xl font-black">
                {data.stats.inquiries}
                <span className="ml-1 text-lg font-bold">건</span>
              </p>
              <button className="rounded-full bg-white/20 p-2 backdrop-blur-md hover:bg-white/30">
                <Icon name="chat_bubble" className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex flex-col items-center justify-between overflow-hidden rounded-xl bg-on-surface p-8 text-white md:flex-row">
        <div className="z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary-fixed">
            <Icon name="business_center" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {data.businessBanner.eyebrow}
            </span>
          </div>
          <h2 className="font-headline text-2xl font-bold">
            {data.businessBanner.title}
          </h2>
          <p className="text-sm opacity-80">{data.businessBanner.description}</p>
        </div>
        <div className="z-10 mt-6 md:mt-0">
          <button className="rounded-full bg-primary px-8 py-3 font-bold text-white transition-all hover:bg-primary-container active:scale-95">
            {data.businessBanner.ctaLabel}
          </button>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-primary/20" />
      </section>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-10 lg:col-span-2">
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-headline text-xl font-extrabold">
                <Icon name="recycling" className="text-primary" />
                {data.labels.frequentlyBoughtTitle}
              </h3>
              <Link
                href="/products"
                className="text-sm font-bold text-on-surface-variant transition-colors hover:text-primary"
              >
                {data.labels.viewAll}
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {data.frequentlyBought.map((product) => (
                <article
                  key={product.productId}
                  className="group flex items-center gap-4 rounded-xl bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high"
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex h-full flex-grow flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">
                        {product.eyebrow}
                      </span>
                      <h4 className="line-clamp-1 font-bold text-on-surface">
                        {product.name}
                      </h4>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="font-headline text-lg font-black text-primary">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="text-xs italic text-on-surface-variant line-through">
                          {formatCurrency(product.priceOriginal)}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/products/${product.productId}`}
                      className="mt-2 flex w-max items-center justify-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-primary-container active:scale-90"
                    >
                      <Icon name="shopping_basket" className="text-sm" />
                      {data.labels.reorderCta}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-headline text-xl font-extrabold">
                <Icon name="local_shipping" className="text-primary" />
                {data.labels.recentOrdersTitle}
              </h3>
            </div>
            <div className="flex flex-col gap-6">
              {data.recentOrders.map((order) => (
                <article
                  key={order.id}
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
                    <Link
                      href={`/orders/${order.id}/tracking`}
                      className="flex items-center gap-1 text-xs font-bold text-primary"
                    >
                      {data.labels.viewOrderDetail}
                      <Icon name="arrow_forward" className="text-[10px]" />
                    </Link>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="flex -space-x-4">
                        <div className="h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-surface">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={order.imageUrl}
                            alt={order.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {order.extras > 0 ? (
                          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-surface-container">
                            <span className="text-xs font-bold">+{order.extras}</span>
                          </div>
                        ) : null}
                      </div>
                      <div className="flex-grow">
                        <h5 className="text-lg font-bold">{order.title}</h5>
                        <p className="text-sm font-medium text-on-surface-variant">
                          {order.status}
                        </p>
                      </div>
                      <Link
                        href={`/reorder?orderId=${order.id}`}
                        className={
                          "flex items-center gap-2 rounded-full px-6 py-3 font-bold transition-all" +
                          (order.primary
                            ? " bg-secondary-container text-white hover:opacity-90 active:scale-95"
                            : " bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high")
                        }
                      >
                        <Icon name="add_shopping_cart" />
                        {data.labels.reorderAll}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/20 bg-surface-bright/80 p-6 shadow-xl backdrop-blur-2xl">
            <h4 className="mb-4 flex items-center gap-2 font-headline font-bold">
              <Icon name="bolt" filled className="text-primary" />
              {data.labels.quickReorderTitle}
            </h4>
            <div className="flex flex-col gap-3">
              {data.quickReorder.map((item) => (
                <Link
                  key={item.productId}
                  href={`/products/${item.productId}`}
                  className="flex items-center justify-between rounded-lg bg-white p-3"
                >
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="rounded-md bg-primary-fixed p-1 text-primary">
                    <Icon name="add" className="text-sm" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl bg-surface-container p-4">
            {data.sidebarLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
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
              </Link>
            ))}
          </div>

          <button className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-on-surface p-5 font-bold text-white transition-all hover:bg-primary active:scale-95">
            <Icon
              name="support_agent"
              className="transition-transform group-hover:rotate-12"
            />
            {data.labels.inquiryCta}
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
