"use client";

import { useState } from "react";
import type { OrderRecord } from "@/features/order/types";
import { Icon } from "@/shared/ui/Icon";

type Props = {
  orders: OrderRecord[];
};

const HEADERS = [
  "주문번호",
  "주문일시",
  "고객유형",
  "고객명",
  "수취인",
  "배송지",
  "상품 요약",
  "상품 수",
  "상품 합계",
  "배송비",
  "총 결제금액",
  "주문 상태",
  "결제 상태",
  "운송장",
  "택배사"
] as const;

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function buildRow(order: OrderRecord): string {
  const itemSummary =
    order.items.length > 1
      ? `${order.items[0].productName} 외 ${order.items.length - 1}건`
      : order.items[0]?.productName ?? "";
  const itemCount = order.items.reduce((sum, it) => sum + it.quantity, 0);

  return [
    order.orderNumber,
    order.orderedAt,
    order.customerType,
    order.customerName,
    order.recipient,
    order.shippingAddress,
    itemSummary,
    String(itemCount),
    String(order.subtotal),
    String(order.shippingFee),
    String(order.total),
    order.orderStatus,
    order.paymentStatus,
    order.trackingNumber ?? "",
    order.courierName ?? ""
  ]
    .map(csvEscape)
    .join(",");
}

function buildCsv(orders: OrderRecord[]): string {
  const lines = [HEADERS.join(","), ...orders.map(buildRow)];
  return lines.join("\r\n");
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

export function AdminOrdersCsvButton({ orders }: Readonly<Props>) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (orders.length === 0 || downloading) return;
    setDownloading(true);

    try {
      // Excel 한글 호환을 위한 UTF-8 BOM
      const bom = "﻿";
      const csv = bom + buildCsv(orders);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `dokkaebi-orders-${timestamp()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const disabled = orders.length === 0 || downloading;

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={disabled}
      aria-label={`현재 필터의 주문 ${orders.length}건을 CSV 로 다운로드`}
      className="flex items-center gap-1 rounded-xl border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-on-surface-variant hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon name="download" className="text-base" />
      {downloading ? "내려받는 중..." : `CSV 다운로드 (${orders.length})`}
    </button>
  );
}
