"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ORDER_STATUS_LABEL,
  type OrderRecord,
  type OrderStatus
} from "@/features/order/types";
import { formatCurrency } from "@/shared/lib/format";
import { Icon } from "@/shared/ui/Icon";

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PREPARING",
  "SHIPPING",
  "DELIVERED",
  "CANCELLED"
];

const STATUS_TONE: Record<OrderStatus, string> = {
  PENDING: "bg-surface-container-high text-on-surface-variant",
  PAID: "bg-primary/10 text-primary",
  PREPARING: "bg-secondary-container/20 text-secondary-container",
  SHIPPING: "bg-secondary-container/30 text-secondary-container",
  DELIVERED: "bg-primary/15 text-primary",
  CANCELLED: "bg-error-container/40 text-on-error-container"
};

type AdminOrdersTableProps = {
  orders: OrderRecord[];
};

export function AdminOrdersTable({ orders }: Readonly<AdminOrdersTableProps>) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<{ id: string; message: string } | null>(
    null
  );
  const [cancelTarget, setCancelTarget] = useState<OrderRecord | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    if (nextStatus === "CANCELLED") {
      const target = orders.find((o) => o.id === orderId);
      if (target) {
        setCancelTarget(target);
        setCancelReason("");
        setCancelError(null);
      }
      return;
    }
    setPendingId(orderId);
    setRowError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: nextStatus })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setRowError({
          id: orderId,
          message: body?.message ?? "상태 변경에 실패했습니다"
        });
        return;
      }
      startTransition(() => router.refresh());
    } finally {
      setPendingId(null);
    }
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    const reason = cancelReason.trim();
    if (!reason) {
      setCancelError("취소 사유를 입력해주세요");
      return;
    }
    setCancelSubmitting(true);
    setCancelError(null);
    try {
      const res = await fetch(`/api/orders/${cancelTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: "CANCELLED",
          cancellationReason: reason
        })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setCancelError(body?.message ?? "취소 처리에 실패했습니다");
        return;
      }
      setCancelTarget(null);
      startTransition(() => router.refresh());
    } finally {
      setCancelSubmitting(false);
    }
  };

  const visibleIds = useMemo(() => orders.map((order) => order.id), [orders]);

  const allChecked =
    visibleIds.length > 0 &&
    visibleIds.every((id) => selectedIds.has(id));
  const someChecked =
    visibleIds.some((id) => selectedIds.has(id)) && !allChecked;

  const toggleAll = () => {
    setSelectedIds((prev) => {
      if (allChecked) {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.delete(id));
        return next;
      }
      const next = new Set(prev);
      visibleIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedInVisible = visibleIds.filter((id) => selectedIds.has(id));

  const handleBulkStatus = () => {
    if (selectedInVisible.length === 0) return;
    // TODO: API 연결 시 PATCH /api/orders/bulk-status
    window.alert(
      `선택한 ${selectedInVisible.length}건의 상태를 일괄 변경합니다.\n${selectedInVisible.join(", ")}`
    );
  };

  const handleBulkInvoice = () => {
    if (selectedInVisible.length === 0) return;
    window.alert(
      `선택한 ${selectedInVisible.length}건에 송장을 일괄 등록합니다.\n${selectedInVisible.join(", ")}`
    );
  };

  return (
    <>
      <div className="overflow-x-auto rounded-3xl bg-surface-container-lowest shadow-lift">
        <table className="w-full min-w-[960px] text-sm">
          <thead className="bg-surface-container-low text-xs text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">
                <input
                  type="checkbox"
                  ref={(el) => {
                    if (el) el.indeterminate = someChecked;
                  }}
                  checked={allChecked}
                  onChange={toggleAll}
                  aria-label={allChecked ? "전체 선택 해제" : "전체 선택"}
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
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-sm text-on-surface-variant"
                >
                  조건에 맞는 주문이 없습니다.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isSelected = selectedIds.has(order.id);
                return (
                  <tr
                    key={order.id}
                    className={
                      isSelected
                        ? "bg-primary/5"
                        : "hover:bg-surface-container-low"
                    }
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(order.id)}
                        aria-label={`${order.orderNumber} 선택`}
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
                      <select
                        value={order.orderStatus}
                        onChange={(event) =>
                          handleStatusChange(
                            order.id,
                            event.target.value as OrderStatus
                          )
                        }
                        disabled={pendingId === order.id}
                        aria-label={`${order.orderNumber} 상태 변경`}
                        className={`cursor-pointer rounded-full border-none px-2.5 py-1 text-xs font-bold outline-none focus:ring-2 focus:ring-primary ${STATUS_TONE[order.orderStatus]}`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="bg-white text-on-surface"
                          >
                            {ORDER_STATUS_LABEL[status]}
                          </option>
                        ))}
                      </select>
                      {rowError?.id === order.id && (
                        <p className="mt-1 text-[10px] font-semibold text-error">
                          {rowError.message}
                        </p>
                      )}
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bulk actions */}
      <div className="flex items-center justify-between rounded-3xl bg-surface-container-lowest p-4 shadow-lift">
        <p className="text-sm text-on-surface-variant">
          <span className="font-bold text-on-surface">{orders.length}</span>건 표시 중
          {selectedInVisible.length > 0 && (
            <span className="ml-3 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {selectedInVisible.length}건 선택됨
            </span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBulkStatus}
            disabled={selectedInVisible.length === 0}
            className={
              selectedInVisible.length > 0
                ? "rounded-xl border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-on-surface-variant hover:border-primary"
                : "cursor-not-allowed rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2 text-sm font-semibold text-on-surface-variant/40"
            }
          >
            상태 일괄 변경
          </button>
          <button
            type="button"
            onClick={handleBulkInvoice}
            disabled={selectedInVisible.length === 0}
            className={
              selectedInVisible.length > 0
                ? "rounded-xl bg-secondary-container px-4 py-2 text-sm font-bold text-on-secondary"
                : "cursor-not-allowed rounded-xl bg-surface-container-high px-4 py-2 text-sm font-bold text-on-surface-variant/40"
            }
          >
            송장 일괄 등록
          </button>
        </div>
      </div>

      {cancelTarget && (
        <div
          role="presentation"
          onClick={() => !cancelSubmitting && setCancelTarget(null)}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-surface-container-lowest p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
                <Icon name="cancel" className="text-xl text-error" />
              </div>
              <div>
                <h2 className="font-headline text-lg font-black text-on-surface">
                  주문을 취소합니다
                </h2>
                <p className="text-xs text-on-surface-variant">
                  {cancelTarget.orderNumber} · {cancelTarget.customerName}
                </p>
              </div>
            </div>
            <p className="mb-4 rounded-xl bg-warning-container/30 px-3 py-2 text-xs text-on-surface">
              취소 시 재고가 복구되고, 결제 완료 건은 환불 처리됩니다.
            </p>
            <label className="mb-4 block">
              <span className="mb-1 block text-xs font-bold text-on-surface-variant">
                취소 사유 (필수)
              </span>
              <textarea
                value={cancelReason}
                onChange={(e) => {
                  setCancelReason(e.target.value);
                  setCancelError(null);
                }}
                maxLength={200}
                rows={3}
                autoFocus
                className="w-full rounded-xl border border-outline-variant px-3 py-2 text-sm focus:border-primary focus:outline-none"
                placeholder="예) 고객 요청으로 취소 / 재고 부족 / 결제 오류"
              />
            </label>
            {cancelError && (
              <p className="mb-3 rounded-xl bg-error/10 px-3 py-2 text-xs font-semibold text-error">
                {cancelError}
              </p>
            )}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                disabled={cancelSubmitting}
                className="rounded-full border border-outline-variant px-5 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                disabled={cancelSubmitting}
                className="flex items-center justify-center rounded-full bg-error px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
              >
                {cancelSubmitting ? "취소 중..." : "주문 취소"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
