"use client";

import { useState } from "react";
import type { OrderRecord } from "@/features/order/types";

type Props = {
  label: string;
};

const HEADERS = [
  "주문번호",
  "주문일시",
  "고객유형",
  "고객명",
  "수취인",
  "상태",
  "결제",
  "상품수",
  "소계",
  "배송비",
  "총액"
] as const;

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function buildRow(o: OrderRecord): string {
  const itemCount = o.items.reduce((sum, it) => sum + it.quantity, 0);
  return [
    o.orderNumber,
    o.orderedAt,
    o.customerType,
    o.customerName,
    o.recipient,
    o.orderStatus,
    o.paymentStatus,
    String(itemCount),
    String(o.subtotal),
    String(o.shippingFee),
    String(o.total)
  ]
    .map(csvEscape)
    .join(",");
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

export function DashboardReportButton({ label }: Readonly<Props>) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (downloading) return;
    setDownloading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) {
        setError("리포트 데이터를 불러오지 못했습니다");
        return;
      }
      const body = (await res.json()) as { items: OrderRecord[] };
      const lines = [HEADERS.join(","), ...body.items.map(buildRow)];
      const csv = "﻿" + lines.join("\r\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `dokkaebi-orders-report-${timestamp()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={downloading}
        className="rounded-xl border-2 border-outline-variant px-6 py-2.5 text-sm font-bold text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-50"
      >
        {downloading ? "내려받는 중..." : label}
      </button>
      {error && (
        <p className="text-[11px] font-semibold text-error">{error}</p>
      )}
    </div>
  );
}
