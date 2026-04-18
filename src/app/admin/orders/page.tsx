import { sampleOrders } from "@/features/order/mock-data";
import { ORDER_STATUS_LABEL } from "@/features/order/types";
import type { OrderStatus } from "@/features/order/types";
import { formatCurrency } from "@/lib/format";
import { Icon } from "@/components/common/Icon";

const STATUS_FILTERS: Array<{ key: OrderStatus | "ALL"; label: string }> = [
  { key: "ALL", label: "전체" },
  { key: "PAID", label: "결제 완료" },
  { key: "PREPARING", label: "준비중" },
  { key: "SHIPPING", label: "배송중" },
  { key: "DELIVERED", label: "완료" },
  { key: "CANCELLED", label: "취소" }
];

const STATUS_TONE: Record<OrderStatus, string> = {
  PENDING: "bg-surface-container-high text-on-surface-variant",
  PAID: "bg-primary/10 text-primary",
  PREPARING: "bg-secondary-container/20 text-secondary-container",
  SHIPPING: "bg-secondary-container/30 text-secondary-container",
  DELIVERED: "bg-primary/15 text-primary",
  CANCELLED: "bg-error-container/40 text-on-error-container"
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            order management
          </p>
          <h1 className="mt-2 font-headline text-3xl font-black">주문 관리</h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            상태별로 주문을 필터링하고 일괄 처리할 수 있습니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 rounded-xl border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-on-surface-variant hover:border-primary">
            <Icon name="download" className="text-base" /> CSV 다운로드
          </button>
          <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white">
            새 주문 만들기
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-3xl bg-surface-container-lowest p-4 shadow-lift">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="search"
            placeholder="주문번호, 고객명 검색"
            className="w-full rounded-xl bg-surface-container-highest px-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <Icon
            name="search"
            className="absolute left-3 top-2.5 text-on-surface-variant"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((filter, idx) => (
            <button
              key={filter.key}
              className={
                idx === 0
                  ? "rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white"
                  : "rounded-full bg-surface-container-low px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              }
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl bg-surface-container-lowest shadow-lift">
        <table className="w-full text-sm">
          <thead className="bg-surface-container-low text-xs text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold">주문번호</th>
              <th className="px-4 py-3 text-left font-semibold">고객</th>
              <th className="px-4 py-3 text-left font-semibold">상품</th>
              <th className="px-4 py-3 text-left font-semibold">주문일</th>
              <th className="px-4 py-3 text-left font-semibold">상태</th>
              <th className="px-4 py-3 text-right font-semibold">금액</th>
              <th className="px-4 py-3 text-right font-semibold">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {sampleOrders.map((order) => (
              <tr key={order.id} className="hover:bg-surface-container-low">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-4 font-mono text-xs text-on-surface">
                  {order.orderNumber}
                </td>
                <td className="px-4 py-4">
                  <p className="font-bold">{order.customerName}</p>
                  <p className="text-xs text-on-surface-variant">
                    {order.customerType === "BUSINESS" ? "사업자" : "일반"} · {order.recipient}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold">
                    {order.items[0].productName}
                    {order.items.length > 1 && (
                      <span className="ml-1 text-xs text-on-surface-variant">
                        외 {order.items.length - 1}건
                      </span>
                    )}
                  </p>
                </td>
                <td className="px-4 py-4 text-on-surface-variant">
                  {order.orderedAt}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_TONE[order.orderStatus]}`}
                  >
                    {ORDER_STATUS_LABEL[order.orderStatus]}
                  </span>
                </td>
                <td className="px-4 py-4 text-right font-headline font-bold text-primary">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-4 py-4 text-right">
                  <button className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container">
                    <Icon name="more_vert" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bulk actions */}
      <div className="flex items-center justify-between rounded-3xl bg-surface-container-lowest p-4 shadow-lift">
        <p className="text-sm text-on-surface-variant">
          <span className="font-bold text-on-surface">{sampleOrders.length}</span>건 표시 중
        </p>
        <div className="flex items-center gap-2">
          <button className="rounded-xl border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-on-surface-variant hover:border-primary">
            상태 일괄 변경
          </button>
          <button className="rounded-xl bg-secondary-container px-4 py-2 text-sm font-bold text-on-secondary">
            송장 일괄 등록
          </button>
        </div>
      </div>
    </div>
  );
}
