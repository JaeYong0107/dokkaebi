import { notFound } from "next/navigation";
import {
  getOrderById,
  sampleOrders
} from "@/mocks/orders";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_TIMELINE,
  type OrderStatus
} from "@/features/order/types";
import { formatCurrency } from "@/shared/lib/format";
import { Icon } from "@/shared/ui/Icon";

type TrackingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function buildTimeline(orderStatus: OrderStatus) {
  const timelineSteps = ORDER_STATUS_TIMELINE.filter(
    (step): step is "PAID" | "PREPARING" | "SHIPPING" | "DELIVERED" =>
      step === "PAID" ||
      step === "PREPARING" ||
      step === "SHIPPING" ||
      step === "DELIVERED"
  );
  const labels: Record<(typeof timelineSteps)[number], string> = {
    PAID: "결제 완료",
    PREPARING: "상품 준비중",
    SHIPPING: "배송중",
    DELIVERED: "배송 완료"
  };
  const descriptions: Record<(typeof timelineSteps)[number], string> = {
    PAID: "결제와 주문 접수가 정상적으로 완료되었습니다.",
    PREPARING: "물류센터에서 상품 검수 및 출고 준비 중입니다.",
    SHIPPING: "택배사로 인계되어 배송 경로를 이동하고 있습니다.",
    DELIVERED: "상품이 배송 완료 처리되었습니다."
  };

  const normalizedStatus =
    orderStatus === "PENDING" || orderStatus === "CANCELLED"
      ? "PAID"
      : orderStatus;
  const activeIndex = Math.max(timelineSteps.indexOf(normalizedStatus), 0);

  return timelineSteps.map((step, index) => {
    const state =
      index < activeIndex ? "done" : index === activeIndex ? "current" : "pending";

    return {
      step: `Step ${String(index + 1).padStart(2, "0")}`,
      title: labels[step],
      date: index <= activeIndex ? "처리됨" : "예정",
      desc: descriptions[step],
      state
    };
  });
}

export default async function TrackingPage({ params }: TrackingPageProps) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

  const timeline = buildTimeline(order.orderStatus);
  const currentStep =
    timeline.find((step) => step.state === "current") ??
    timeline[timeline.length - 1];
  const hasTrackingNumber = Boolean(order.trackingNumber && order.courierName);
  const firstItem = order.items[0];

  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">
            TRACKING YOUR ORDER
          </span>
          <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface">
            배송 상세 정보
          </h1>
          <p className="mt-2 font-medium text-on-surface-variant">
            운송장 번호:{" "}
            <span className="font-bold text-on-surface">
              {order.trackingNumber ?? "송장 등록 전"}
            </span>{" "}
            <span className="ml-2 rounded bg-surface-container-high px-2 py-0.5 text-xs">
              {order.courierName ?? "택배사 확인 중"}
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-surface-container-highest px-6 py-3 font-bold text-on-surface transition-colors hover:bg-surface-variant"
          >
            <Icon name="print" className="text-[20px]" />
            영수증 출력
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:scale-105"
          >
            <Icon name="support_agent" className="text-[20px]" />
            고객센터 문의
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-surface-container-lowest p-8 shadow-sm">
            <div className="mb-12 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed">
                  <Icon name="local_shipping" filled />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {ORDER_STATUS_LABEL[order.orderStatus]}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    {hasTrackingNumber
                      ? "운송장과 택배사 정보가 등록되었습니다."
                      : "아직 송장 등록 전입니다. 준비 상태를 먼저 확인해 주세요."}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold uppercase tracking-wider text-outline">
                  Order Number
                </span>
                <span className="text-2xl font-black text-primary">
                  {order.orderNumber}
                </span>
              </div>
            </div>

            <div className="relative px-4">
              <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-surface-container-high" />
              <div
                className="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-primary transition-all duration-1000"
                style={{
                  width: `${((timeline.findIndex((step) => step.state === "current") + 1) / timeline.length) * 100}%`
                }}
              />
              <div className="relative flex justify-between">
                {timeline.map((step) => {
                  const isActive = step.state !== "pending";
                  return (
                    <div key={step.step} className="flex flex-col items-center gap-3">
                      <div
                        className={
                          "z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-surface-container-lowest " +
                          (isActive
                            ? "bg-primary text-white shadow-md"
                            : "bg-surface-container-high text-outline-variant")
                        }
                      >
                        <Icon
                          name={step.state === "pending" ? "pending" : "check"}
                          className="text-sm"
                        />
                      </div>
                      <span
                        className={
                          "text-sm " +
                          (isActive
                            ? "font-bold text-primary"
                            : "font-medium text-outline")
                        }
                      >
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-surface-container-lowest p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">현재 배송 메모</h3>
                <p className="mt-2 text-sm text-on-surface-variant">
                  {currentStep.desc}
                </p>
              </div>
              <div className="rounded-2xl bg-surface-container-high px-4 py-3 text-sm font-bold text-primary">
                {currentStep.step}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <div className="space-y-6 rounded-[2rem] bg-surface-container p-8">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-extrabold tracking-tight">배송지 정보</h3>
              <button
                type="button"
                className="text-sm font-bold text-primary hover:underline"
              >
                변경하기
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-outline">
                  Receiver
                </span>
                <p className="text-lg font-bold">{order.recipient}</p>
              </div>
              <div>
                <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-outline">
                  Address
                </span>
                <p className="font-medium leading-relaxed text-on-surface-variant">
                  {order.shippingAddress}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-surface-container-high bg-surface-container-lowest p-8">
            <h3 className="mb-6 text-xl font-extrabold tracking-tight">
              주문 상품 요약
            </h3>
            <div className="rounded-2xl bg-surface p-4">
              <p className="line-clamp-1 font-bold">
                {firstItem.productName}
                {order.items.length > 1 && (
                  <span className="ml-1 text-sm font-normal text-on-surface-variant">
                    외 {order.items.length - 1}건
                  </span>
                )}
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                주문번호: {order.orderNumber}
              </p>
              <p className="mt-1 font-bold text-primary">
                {formatCurrency(order.total)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h3 className="mb-8 text-2xl font-extrabold tracking-tight">
          실시간 배송 타임라인
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {timeline.map((step) => {
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
                      name={step.state === "pending" ? "pending" : "check"}
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
                    isCurrent ? "mb-1 font-black text-primary" : "mb-1 font-bold"
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
