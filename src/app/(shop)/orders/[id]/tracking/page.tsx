import { Icon } from "@/components/common/Icon";

const TIMELINE = [
  {
    step: "Step 01",
    title: "상품 준비 완료",
    date: "10월 24일 09:12",
    desc: "경기도 광주 통합물류센터에서 상품 검수가 완료되었습니다.",
    state: "done"
  },
  {
    step: "Step 02",
    title: "터미널 입고",
    date: "10월 24일 14:45",
    desc: "이천 Hub 터미널에 입고되어 간선 상차 작업 중입니다.",
    state: "done"
  },
  {
    step: "Step 03 (Current)",
    title: "간선 하차",
    date: "10월 25일 08:30",
    desc: "서초구 배송 캠프에 도착하여 배송 기사님 배정 중입니다.",
    state: "current"
  },
  {
    step: "Step 04",
    title: "배송 완료 예정",
    date: "오늘 도착 예정",
    desc: "고객님의 소중한 상품이 곧 도착할 예정입니다.",
    state: "pending"
  }
];

const MAP_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAyc-gwPFj4FfpUPkAKXjs8a9DWYu07fo8PxfcOioGqIlyWhwG0bbQOL0GnQJ7GtzXcvecoCe8OwnHbmdwNLEU0DDAWGXzBAA0vjcZurpKXBHO1Gd9W_JHxb5of1uVkSmZGpw7vkFu_KY9c86m3IO1VXZUfk0m_ubJEVLPQXGdnAqBSPvp4tcCP2DMd4W3i1IdohGBa-Fx_I4I3JxgL2UxZX19Ew6dy3_U96Q_spMMb-OVFjIPPyQv27HHBWnVOr0U5Ty0pXiRlTfA";

const COURIER_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBvLjptU4zqFl57ltCUto6N9OkURh8svPmR4wgs7Ht2jrkmkgqLz-tF6ZDrwX6-ZVNkqbyHV92QIz9fJ_tDx00Z9PFyBE0QPPsM4sojYEC6oGg83zLQuwF1DP5vsfKJWQj-ctA4lEj2sOu4LWvdO0djd6SrlGv918BgfSRjbi6XKG18G-_l5VVsTi1BoAewNxhNfUhfjH0H10Kf0-M-FUZrTMlbUVYFM2RxEyXxFs2bnBBMU2ucBcR7DenG8h_kx_fMrlhtXrldoxc";

const PRODUCT_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDvB2UVENn8pUPZbXqaf5lp4Stj0RE-MPvOp6i4Cyg6SMXuhtF8hMNn2353Vmlzmu2adDj1OacK4oo4KcZQ4BSwcssyXLwNkE_WrB1EQYSNcnBfNOdrrweWCYxFoUBzRKFhWtzrfFLUyeNBqPHg6PbyBNeqr5kg5boLpYKljPuVzowI8gee1X1QkrcObu-Vdam-Qdarazg10IN8wNdDuhoJh_9vZS5sxS41Aoegh6753AZKwt9CG9Jtbou77yw_yB8wI0AlIk8MWV0";

function getStepIcon(state: string) {
  if (state === "current") return "sync";
  if (state === "pending") return "pending";
  return "check";
}

export default function TrackingPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      {/* Tracker Header */}
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">
            TRACKING YOUR ORDER
          </span>
          <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface">
            배송 상세 정보
          </h1>
          <p className="mt-2 font-medium text-on-surface-variant">
            운송장 번호: <span className="font-bold text-on-surface">7502-3948-1102</span>{" "}
            <span className="ml-2 rounded bg-surface-container-high px-2 py-0.5 text-xs">
              CJ대한통운
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-surface-container-highest px-6 py-3 font-bold text-on-surface transition-colors hover:bg-surface-variant">
            <Icon name="print" className="text-[20px]" />
            영수증 출력
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:scale-105">
            <Icon name="support_agent" className="text-[20px]" />
            고객센터 문의
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-8">
          {/* Status Visualizer */}
          <div className="relative overflow-hidden rounded-[2rem] bg-surface-container-lowest p-8 shadow-sm">
            <div className="mb-12 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed">
                  <Icon name="local_shipping" filled />
                </div>
                <div>
                  <h3 className="text-xl font-bold">배송중</h3>
                  <p className="text-sm text-on-surface-variant">
                    오늘 오후 2시 - 4시 사이 도착 예정
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold uppercase tracking-wider text-outline">
                  Estimated Delivery
                </span>
                <span className="text-2xl font-black text-primary">Today, 15:30</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="relative px-4">
              <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-surface-container-high" />
              <div className="absolute left-0 top-1/2 h-1 w-2/3 -translate-y-1/2 bg-primary transition-all duration-1000" />
              <div className="relative flex justify-between">
                {[
                  { icon: "inventory_2", label: "상품준비중", done: true },
                  { icon: "conveyor_belt", label: "배송중", done: true },
                  { icon: "home_pin", label: "배송완료", done: false }
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center gap-3">
                    <div
                      className={
                        "z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-surface-container-lowest " +
                        (s.done
                          ? "bg-primary text-white shadow-md"
                          : "bg-surface-container-high text-outline-variant")
                      }
                    >
                      <Icon name={s.icon} className="text-sm" />
                    </div>
                    <span
                      className={
                        "text-sm " +
                        (s.done ? "font-bold text-primary" : "font-medium text-outline")
                      }
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Map */}
          <div className="group relative aspect-[16/9] overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MAP_IMG}
              alt="Live delivery map"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            {/* Courier Card */}
            <div
              className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl border border-white/20 p-6 shadow-2xl"
              style={{
                background: "rgba(246, 251, 241, 0.7)",
                backdropFilter: "blur(24px)"
              }}
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-primary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={COURIER_IMG}
                    alt="Courier"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">김태호 기사님</h4>
                  <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                    <Icon
                      name="star"
                      className="text-[16px] text-secondary"
                    />
                    <span>4.9 (2,400+)</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-xl bg-white/90 p-3 transition-colors hover:bg-white">
                  <Icon name="call" className="text-primary" />
                </button>
                <button className="rounded-xl bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary-container">
                  메세지 보내기
                </button>
              </div>
            </div>
            {/* Map Legend */}
            <div className="absolute right-6 top-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-xs font-bold shadow-sm backdrop-blur-md">
                <div className="h-2 w-2 rounded-full bg-primary" />
                현재 위치
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-xs font-bold shadow-sm backdrop-blur-md">
                <div className="h-2 w-2 rounded-full bg-secondary" />
                목적지
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-4">
          {/* Shipping Address */}
          <div className="space-y-6 rounded-[2rem] bg-surface-container p-8">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-extrabold tracking-tight">배송지 정보</h3>
              <button className="text-sm font-bold text-primary hover:underline">
                변경하기
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-outline">
                  Receiver
                </span>
                <p className="text-lg font-bold">
                  홍길동{" "}
                  <span className="ml-2 text-sm font-medium text-on-surface-variant">
                    010-****-5678
                  </span>
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1 text-[11px] font-bold text-primary">
                  <Icon name="verified_user" className="text-[14px]" />
                  안심번호 사용중
                </div>
              </div>
              <div>
                <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-outline">
                  Address
                </span>
                <p className="font-medium leading-relaxed text-on-surface-variant">
                  서울특별시 강남구 테헤란로 427
                  <br />
                  위워크 타워 15층 102호
                </p>
              </div>
            </div>
            <div className="border-t border-outline-variant/30 pt-6">
              <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-outline">
                Delivery Note
              </span>
              <div className="rounded-xl bg-surface-container-lowest p-4 text-sm italic text-on-surface-variant">
                "문 앞에 놓아주시고 벨은 누르지 말아주세요. 감사합니다!"
              </div>
            </div>
          </div>

          {/* Package Summary */}
          <div className="rounded-[2rem] border border-surface-container-high bg-surface-container-lowest p-8">
            <h3 className="mb-6 text-xl font-extrabold tracking-tight">
              주문 상품 요약
            </h3>
            <div className="flex items-center gap-4 rounded-2xl bg-surface p-4">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PRODUCT_IMG}
                  alt="Product"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="line-clamp-1 font-bold">
                  친환경 유기농 신선 채소 세트 외 3건
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  주문번호: 20231024-001248
                </p>
                <p className="mt-1 font-bold text-primary">₩54,900</p>
              </div>
            </div>
            <button className="mt-6 w-full rounded-xl border-2 border-surface-container-highest py-4 font-bold text-on-surface-variant transition-colors hover:bg-surface">
              상세 주문 내역 보기
            </button>
          </div>

          {/* Promo */}
          <div className="group relative overflow-hidden rounded-[2rem] bg-secondary-container p-8 text-on-secondary-container">
            <div className="relative z-10">
              <h4 className="mb-2 text-2xl font-black tracking-tighter">
                무료 배송 혜택
              </h4>
              <p className="text-sm font-medium leading-snug opacity-90">
                지금 멤버십 가입하고 모든 주문에 대해 무제한 무료 배송을 받으세요.
              </p>
              <button className="mt-6 rounded-full bg-on-secondary-container px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-transform hover:scale-105">
                Join Now
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 transform opacity-20 transition-transform duration-500 group-hover:scale-110">
              <Icon name="redeem" className="text-[160px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <section className="mt-16">
        <h3 className="mb-8 text-2xl font-extrabold tracking-tight">
          실시간 배송 타임라인
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TIMELINE.map((step) => {
            const isCurrent = step.state === "current";
            const isPending = step.state === "pending";
            return (
              <div
                key={step.step}
                className={
                  "relative rounded-2xl p-6 " +
                  (isCurrent
                    ? "border-2 border-primary bg-surface-container-highest ring-4 ring-primary/5"
                    : "bg-surface-container-low") +
                  (isPending ? " opacity-50" : "")
                }
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={
                      "flex h-8 w-8 items-center justify-center rounded-full text-white " +
                      (step.state === "done" || isCurrent
                        ? "bg-primary shadow-lg shadow-primary/20"
                        : "bg-outline-variant")
                    }
                  >
                    <Icon
                      name={getStepIcon(step.state)}
                      className="text-[16px]"
                    />
                  </div>
                  <span
                    className={
                      "text-xs font-bold uppercase tracking-wider " +
                      (isCurrent ? "text-primary" : "text-outline")
                    }
                  >
                    {step.step}
                  </span>
                </div>
                <h4
                  className={
                    isCurrent
                      ? "mb-1 font-black text-primary"
                      : "mb-1 font-bold"
                  }
                >
                  {step.title}
                </h4>
                <p
                  className={
                    isCurrent
                      ? "text-xs font-bold text-primary"
                      : "text-xs text-on-surface-variant"
                  }
                >
                  {step.date}
                </p>
                <p
                  className={
                    "mt-3 text-sm leading-relaxed text-on-surface-variant" +
                    (isCurrent ? " font-medium" : "")
                  }
                >
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
