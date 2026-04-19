import Link from "next/link";
import type { OrderRecord, OrderStatus } from "@/features/order/types";
import { getServerOrigin } from "@/shared/lib/api/server-origin";
import { Icon } from "@/shared/ui/Icon";
import { AdminOrdersSearch } from "@/widgets/admin-orders/AdminOrdersSearch";
import { AdminOrdersTable } from "@/widgets/admin-orders/AdminOrdersTable";

type StatusFilter = "ALL" | OrderStatus;

const STATUS_FILTERS: Array<{ key: StatusFilter; label: string }> = [
  { key: "ALL", label: "전체" },
  { key: "PAID", label: "결제 완료" },
  { key: "PREPARING", label: "준비중" },
  { key: "SHIPPING", label: "배송중" },
  { key: "DELIVERED", label: "완료" },
  { key: "CANCELLED", label: "취소" }
];

function isStatusFilter(value: string | undefined): value is StatusFilter {
  return STATUS_FILTERS.some((filter) => filter.key === value);
}

function buildHref(
  base: string,
  current: Record<string, string | string[] | undefined>,
  updates: Record<string, string | undefined>
) {
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(current)) {
    if (typeof value === "string" && value.length > 0) {
      next.set(key, value);
    }
  }
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  }
  const qs = next.toString();
  return qs ? `${base}?${qs}` : base;
}

export default async function AdminOrdersPage({
  searchParams
}: Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const origin = await getServerOrigin();
  const query = (await searchParams) ?? {};
  const statusFilter: StatusFilter =
    typeof query.status === "string" && isStatusFilter(query.status)
      ? query.status
      : "ALL";
  const keyword =
    typeof query.q === "string" ? query.q.trim().toLowerCase() : "";

  const response = await fetch(`${origin}/api/orders`, { cache: "no-store" });
  const data = (await response.json()) as { items: OrderRecord[] };
  const allOrders = data.items;

  const filteredOrders = allOrders
    .filter((order) =>
      statusFilter === "ALL" ? true : order.orderStatus === statusFilter
    )
    .filter((order) => {
      if (!keyword) return true;
      return (
        order.orderNumber.toLowerCase().includes(keyword) ||
        order.customerName.toLowerCase().includes(keyword) ||
        order.recipient.toLowerCase().includes(keyword)
      );
    });

  const counts: Record<StatusFilter, number> = {
    ALL: allOrders.length,
    PENDING: 0,
    PAID: 0,
    PREPARING: 0,
    SHIPPING: 0,
    DELIVERED: 0,
    CANCELLED: 0
  };
  allOrders.forEach((order) => {
    counts[order.orderStatus] = (counts[order.orderStatus] ?? 0) + 1;
  });

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
        <AdminOrdersSearch />
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((filter) => {
            const isActive = filter.key === statusFilter;
            return (
              <Link
                key={filter.key}
                href={buildHref("/admin/orders", query, {
                  status: filter.key === "ALL" ? undefined : filter.key
                })}
                aria-pressed={isActive}
                className={
                  isActive
                    ? "rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white"
                    : "rounded-full bg-surface-container-low px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                }
              >
                {filter.label}
                <span
                  className={
                    "ml-1.5 text-[10px] " +
                    (isActive
                      ? "text-white/80"
                      : "text-on-surface-variant/60")
                  }
                >
                  {counts[filter.key]}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <AdminOrdersTable orders={filteredOrders} />
    </div>
  );
}
