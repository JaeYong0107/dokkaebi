"use client";

import { useMemo, useState } from "react";
import {
  ORDER_STATUS_LABEL,
  type OrderRecord,
  type OrderStatus
} from "@/features/order/types";
import { formatCurrency } from "@/shared/lib/format";
import { Icon } from "@/shared/ui/Icon";

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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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
      <div className="overflow-hidden rounded-3xl bg-surface-container-lowest shadow-lift">
        <table className="w-full text-sm">
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
    </>
  );
}
