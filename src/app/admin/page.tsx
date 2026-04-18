import { Icon } from "@/shared/ui/Icon";

const ORDERS = [
  {
    id: "#20231102-004",
    name: "이지민",
    product: "유기농 햇 고구마 외 2건",
    price: "₩45,000",
    status: "배송중",
    statusTone: "bg-primary-fixed text-on-primary-fixed"
  },
  {
    id: "#20231102-003",
    name: "박준호",
    product: "무농약 대추방울토마토",
    price: "₩12,800",
    status: "결제완료",
    statusTone: "bg-surface-container-highest text-on-surface-variant"
  },
  {
    id: "#20231102-002",
    name: "김서영",
    product: "프리미엄 꿀사과 5kg",
    price: "₩32,500",
    status: "준비중",
    statusTone: "bg-secondary-fixed text-on-secondary-fixed"
  },
  {
    id: "#20231102-001",
    name: "최현우",
    product: "새벽배송 샐러드 팩",
    price: "₩18,200",
    status: "배송완료",
    statusTone: "bg-surface-container-highest text-on-surface-variant"
  }
];

const SIGNUP_AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDBa6Ct7jwVNvUAYr6kgmgth1swdtFB0uEw5VinC_sQttLFZpfhUovPYQCIQ0Y5jmdAqHx7x3eIO-ZJZDl1txAPPJPc-WcxJyhPU70-6lO9fM7OXYxzTe7jk3e01wIhGDsnRSEG-rdFt-Ms3EMv5nuBA2OGk0Lj0nTufhhpuWQ9DORURHhgk5x9ORjPUQMCoSxaTDolGUzA6o61-Mp8HgN_s52WwQ_2p7hq5Sz_J9B8wPG7YolZf_lmj_7Mo3e9x80iNvn7kJrcOkg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCrwJuVnYCCRlHLiyCeoyGuXUY769ICdQPbILYdBdeyTy-yp5A8I2HNxjYEyQkUqIaRZ2Z5rl5sgRDXeXTvMmSHwP9M4n2eMXCryyNkPFqif4ABd_1IH02NhJ9WQHT8r7jk0JRhcE4mixu1llHJ8m7pMQ-10JhY2GqWtnVUh1GofFh9mfFnPul1os8p_prNjWMGVvGuRziugc9yTZ5Zmg_jMXFuTIcL8sgQunImxAusmrFBnlMxvlAxmCw6Z6zXQ83V-7kiDxdlN2o",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDy_TWQhculgeqTodzEGnSp-1QU-ExByvEnu99f6gHvK0qsQtJYgcFfuyfOSLRB01R3pCuLl3kNSKdGJRAcxXi49DwUW-lsP5gs0QlOX6F5UCx5fzEy-lENeKsoLdCSjm4dn1w5wUUhEMYDpHhujGGD1cz7xhoiaYoESTZODK6zg1VBcfs5Y-W2p8Q6LNXOws3kcij18xDM8Y_XoxGdmstv73jZMobXKWiU3_fDgRTbrTjMhJwspahZuv8i9KuV8e6-037NM0ZY5Tg"
];

const INVENTORY = [
  {
    name: "제주 고당도 감귤",
    remain: "잔여: 5박스",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOU2qeWo2jau70wLLc4hXb7NMvR3g6OF4RXuZkKjBaqBzG5cd2h7qtYyliPBS8DA6G4eEZLbxsGP1Insxgax6NsCkI60ZIwVko2zXLjxlHkTeL1fe7DFZDwOHhWT0DMsRIomgZ-xk1R46drcLDTg9b6h4wBf-rP97l-B2D7VIAzBJZONUhNbQGaHIbQuEC80IM-E_q55B90Yu9LrmxBM3y8JpNgqUWnQ1-5MfVC9-R7tWjD-3zbUrg1WVXgT_fbyGIV3UuEGVl3Yw",
    alt: "Oranges"
  },
  {
    name: "유기농 어린잎 채소",
    remain: "잔여: 2kg",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5hjWMBe3XwWBiMQivRBlmyd3lL8L1o9OVSXfkMEgC1um2HDsLM1mpwXjHN2hpB9aXWV4eZnzmRsuk7b5RMe8ALnIZRp93y2XZHL69R8bZ_amh3d7heUfWdF9nnbhzwdD-3GKStb9Hbd7aGmern72LyPS1WLbRxEcOsSL4qiQNT9D3yf_YktM4MmzBSRPVOzpCO7CeUqBX3tipuA45DXUjQsAaxyqHhKGtivQEdm4z97ceWL2dLnEcSeqJcN_IIz1Jv67yLw7pNZ4",
    alt: "Spinach"
  }
];

const INQUIRIES = [
  {
    title: "배송 지연 문의",
    body: "송장 번호가 조회가 안 돼요. 확인 부탁드려요...",
    meta: "10분 전 · 정우성",
    tone: "bg-secondary"
  },
  {
    title: "반품/교환 신청",
    body: "제품 일부가 파손되어 배송되었습니다...",
    meta: "2시간 전 · 이미연",
    tone: "bg-outline-variant"
  }
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 p-8">
      {/* Today's Order Summary Bento Grid */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[2rem] bg-primary p-8 text-on-primary md:col-span-2">
          <div className="relative z-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary-fixed/80">
              오늘의 총 매출액
            </p>
            <h2 className="text-5xl font-black tracking-tighter">
              ₩12,450,800
            </h2>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold text-on-primary-fixed">
                +12.4%
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
              142
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
              28<span className="ml-1 text-lg font-medium">명</span>
            </h3>
          </div>
          <div className="flex -space-x-3 overflow-hidden">
            {SIGNUP_AVATARS.map((src) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={src}
                src={src}
                alt="avatar"
                className="inline-block h-8 w-8 rounded-full object-cover ring-2 ring-secondary-container"
              />
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-on-secondary-container text-[10px] font-bold text-secondary-container ring-2 ring-secondary-container">
              +15
            </div>
          </div>
        </div>
      </section>

      {/* Main Operational Area */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Orders Table */}
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
                {ORDERS.map((order) => (
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

        {/* Right Sidebar Widgets */}
        <div className="space-y-8">
          {/* Inventory Alert */}
          <div className="space-y-4 rounded-[2rem] bg-surface-container-high p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-extrabold text-on-surface">
                <Icon name="warning" className="text-xl text-error" />
                재고 부족 알림
              </h3>
              <span className="rounded bg-error px-2 py-0.5 text-[10px] font-black text-white">
                3건
              </span>
            </div>
            <div className="space-y-3">
              {INVENTORY.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-4 rounded-2xl bg-surface-container-lowest p-4"
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.img}
                      alt={item.alt}
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

          {/* Customer Inquiries */}
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
              {INQUIRIES.map((inq) => (
                <div key={inq.title} className="flex gap-4">
                  <div
                    className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${inq.tone}`}
                  />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-on-surface">
                      {inq.title}
                    </p>
                    <p className="text-[11px] leading-relaxed text-on-surface-variant">
                      {inq.body}
                    </p>
                    <p className="text-[10px] font-medium text-outline">
                      {inq.meta}
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

      {/* Footer Action Bar */}
      <footer className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Icon name="auto_awesome" className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">
              스마트 자동 발주 시스템
            </p>
            <p className="text-xs text-on-surface-variant">
              현재 데이터 기반 최적의 재고 수준을 유지하고 있습니다.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-xl border-2 border-outline-variant px-6 py-2.5 text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container">
            리포트 다운로드
          </button>
          <button className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-primary/30">
            재고 관리 대장
          </button>
        </div>
      </footer>

      {/* Quick Action FAB */}
      <button className="group fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-on-secondary-container shadow-2xl shadow-secondary/40 transition-transform hover:scale-110">
        <Icon name="add" filled className="text-3xl" />
        <span className="pointer-events-none absolute right-20 whitespace-nowrap rounded-xl bg-inverse-surface px-4 py-2 text-xs font-bold text-inverse-on-surface opacity-0 transition-opacity group-hover:opacity-100">
          새 주문 등록
        </span>
      </button>
    </div>
  );
}
