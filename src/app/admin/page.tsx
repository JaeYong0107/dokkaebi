import { Icon } from "@/shared/ui/Icon";
import { headers } from "next/headers";
import { getServerOrigin } from "@/shared/lib/api/server-origin";

type AdminDashboardResponse = {
  signupAvatars: string[];
  newSignupCount: number;
  salesGrowthRate: number;
  inquiries: Array<{
    title: string;
    body: string;
    meta: string;
    tone: string;
  }>;
  footer: {
    title: string;
    description: string;
    secondaryActionLabel: string;
    primaryActionLabel: string;
  };
  metrics: {
    totalSales: number;
    todayOrderCount: number;
  };
  recentOrders: Array<{
    id: string;
    name: string;
    product: string;
    price: string;
    status: string;
    statusTone: string;
  }>;
  inventory: Array<{
    productId: string;
    name: string;
    remain: string;
    imageUrl?: string;
  }>;
  inquiryCount: number;
  lowInventoryCount: number;
  signupAvatarOverflow: number;
  floatingActionLabel: string;
};

export default async function AdminDashboardPage() {
  const origin = await getServerOrigin();
  const hdrs = await headers();
  const response = await fetch(`${origin}/api/admin/dashboard`, {
    cache: "no-store",
    headers: { cookie: hdrs.get("cookie") ?? "" }
  });
  const data = (await response.json()) as AdminDashboardResponse;

  return (
    <div className="space-y-8 p-8">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[2rem] bg-primary p-8 text-on-primary md:col-span-2">
          <div className="relative z-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary-fixed/80">
              오늘의 총 매출액
            </p>
            <h2 className="text-5xl font-black tracking-tighter">
              ₩{data.metrics.totalSales.toLocaleString("ko-KR")}
            </h2>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold text-on-primary-fixed">
                +{data.salesGrowthRate}%
              </span>
              <span className="text-xs text-primary-fixed/60">
                어제 동시간 대비
              </span>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-primary-container opacity-50 blur-3xl" />
          <div className="absolute right-8 top-8">
            <Icon name="trending_up" className="text-5xl opacity-30" />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[2rem] border-b-4 border-primary bg-surface-container-lowest p-8">
          <div>
            <p className="mb-1 text-xs font-bold text-on-surface-variant">
              오늘 주문건수
            </p>
            <h3 className="text-4xl font-black tracking-tighter text-on-surface">
              {data.metrics.todayOrderCount}
              <span className="ml-1 text-lg font-medium text-on-surface-variant">
                건
              </span>
            </h3>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex gap-1">
              <div className="h-6 w-1.5 rounded-full bg-primary/20" />
              <div className="h-10 w-1.5 rounded-full bg-primary/40" />
              <div className="h-8 w-1.5 rounded-full bg-primary/60" />
              <div className="h-12 w-1.5 rounded-full bg-primary" />
            </div>
            <span className="text-[10px] font-bold text-primary">
              실시간 업데이트
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[2rem] bg-secondary-container p-8 text-on-secondary-container">
          <div>
            <p className="mb-1 text-xs font-bold opacity-80">신규 가입자</p>
            <h3 className="text-4xl font-black tracking-tighter">
              {data.newSignupCount}
              <span className="ml-1 text-lg font-medium">명</span>
            </h3>
          </div>
          <div className="flex -space-x-3 overflow-hidden">
            {data.signupAvatars.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt="avatar"
                className="inline-block h-8 w-8 rounded-full object-cover ring-2 ring-secondary-container"
              />
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-on-secondary-container text-[10px] font-bold text-secondary-container ring-2 ring-secondary-container">
              +{data.signupAvatarOverflow}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-on-surface">
              최근 주문 요약
            </h2>
            <button className="text-sm font-bold text-primary hover:underline">
              전체보기
            </button>
          </div>
          <div className="overflow-hidden rounded-3xl bg-surface-container-low">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/10">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant">
                    주문번호
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant">
                    고객명
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant">
                    상품명
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-on-surface-variant">
                    금액
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase text-on-surface-variant">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {data.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="group cursor-pointer transition-colors hover:bg-surface-container-highest"
                  >
                    <td className="px-6 py-5 text-sm font-medium text-on-surface">
                      {order.id}
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold">
                      {order.name}
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface-variant">
                      {order.product}
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-primary">
                      {order.price}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ${order.statusTone}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4 rounded-[2rem] bg-surface-container-high p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-extrabold text-on-surface">
                <Icon name="warning" className="text-xl text-error" />
                재고 부족 알림
              </h3>
              <span className="rounded bg-error px-2 py-0.5 text-[10px] font-black text-white">
                {data.lowInventoryCount}건
              </span>
            </div>
            <div className="space-y-3">
              {data.inventory.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 rounded-2xl bg-surface-container-lowest p-4"
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-on-surface">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-medium text-error">
                      {item.remain}
                    </p>
                  </div>
                  <button className="rounded-full p-1 text-primary hover:bg-primary/10">
                    <Icon name="add_box" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-[2rem] border border-outline-variant/30 bg-surface-container p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-extrabold text-on-surface">
                <Icon name="forum" className="text-xl text-primary" />
                고객 문의 현황
              </h3>
              <button className="text-[11px] font-bold text-on-surface-variant">
                모두보기
              </button>
            </div>
            <div className="space-y-4">
              {data.inquiries.map((inquiry) => (
                <div key={inquiry.title} className="flex gap-4">
                  <div
                    className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${inquiry.tone}`}
                  />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-on-surface">
                      {inquiry.title}
                    </p>
                    <p className="text-[11px] leading-relaxed text-on-surface-variant">
                      {inquiry.body}
                    </p>
                    <p className="text-[10px] font-medium text-outline">
                      {inquiry.meta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full rounded-xl bg-on-surface py-3 text-xs font-bold text-surface transition-opacity hover:opacity-90">
              문의 응대 시작하기
            </button>
          </div>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Icon name="auto_awesome" className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">
              {data.footer.title}
            </p>
            <p className="text-xs text-on-surface-variant">
              {data.footer.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-xl border-2 border-outline-variant px-6 py-2.5 text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container">
            {data.footer.secondaryActionLabel}
          </button>
          <button className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-primary/30">
            {data.footer.primaryActionLabel}
          </button>
        </div>
      </footer>

      <button className="group fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-on-secondary-container shadow-2xl shadow-secondary/40 transition-transform hover:scale-110">
        <Icon name="add" filled className="text-3xl" />
        <span className="pointer-events-none absolute right-20 whitespace-nowrap rounded-xl bg-inverse-surface px-4 py-2 text-xs font-bold text-inverse-on-surface opacity-0 transition-opacity group-hover:opacity-100">
          {data.floatingActionLabel}
        </span>
      </button>
    </div>
  );
}
