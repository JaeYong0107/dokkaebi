"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import type { Product } from "@/features/product/types";
import {
  getOriginalPrice,
  getUnitPrice
} from "@/features/pricing/pricing-service";

type Props = {
  primaryLabel: string;
  secondaryLabel: string;
};

const HEADERS = [
  "상품 ID",
  "SKU",
  "상품명",
  "카테고리",
  "단위",
  "원산지",
  "정가",
  "일반 할인율",
  "일반가",
  "사업자 할인율",
  "사업자가",
  "재고"
] as const;

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function buildRow(product: Product): string {
  const normal = getUnitPrice(product, "NORMAL");
  const business = getUnitPrice(product, "BUSINESS");
  return [
    product.id,
    product.sku ?? "",
    product.name,
    product.category,
    product.unit,
    product.origin,
    String(getOriginalPrice(product)),
    `${product.normalDiscountRate}%`,
    String(normal),
    `${product.businessDiscountRate}%`,
    String(business),
    String(product.stockQuantity ?? 0)
  ]
    .map(csvEscape)
    .join(",");
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/products", { cache: "no-store" });
  if (!res.ok) throw new Error("상품 정보를 불러오지 못했습니다");
  const body = (await res.json()) as { items: Product[] };
  return body.items.filter((product) => product.isActive);
}

export function BusinessCtaButtons({
  primaryLabel,
  secondaryLabel
}: Readonly<Props>) {
  const { data: session } = useSession();
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const email = session?.user?.email ?? "(비회원)";
  const name = session?.user?.businessName ?? session?.user?.name ?? "";
  const inquiryHref = `mailto:sales@dokkaebi.kr?subject=${encodeURIComponent(
    `[사업자 상담 신청] ${name || email}`
  )}&body=${encodeURIComponent(
    `안녕하세요. 사업자 상담을 요청드립니다.\n\n` +
      `이메일: ${email}\n` +
      (name ? `이름/상호: ${name}\n` : "") +
      `\n상담 희망 내용:\n- 대량 주문 수량:\n- 정기 배송 주기:\n- 기타 요청:\n`
  )}`;

  const handleDownload = async () => {
    if (downloading) return;
    if (!session?.user) {
      setMessage("단가표는 로그인 후 다운로드할 수 있습니다.");
      return;
    }
    if (
      session.user.customerType !== "BUSINESS" ||
      !session.user.businessApproved
    ) {
      setMessage(
        "사업자 승인이 완료된 회원만 단가표를 받을 수 있습니다. 마이페이지에서 사업자 인증을 신청해 주세요."
      );
      return;
    }

    setMessage(null);
    setDownloading(true);
    try {
      const products = await fetchProducts();
      const bom = "﻿";
      const lines = [HEADERS.join(","), ...products.map(buildRow)];
      const csv = bom + lines.join("\r\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `dokkaebi-price-list-${timestamp()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href={inquiryHref}
            className="rounded-full bg-primary px-8 py-4 text-center font-bold text-on-primary transition-all active:scale-95"
          >
            {primaryLabel}
          </a>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="rounded-full border border-stone-200 bg-surface-container-lowest px-8 py-4 font-bold text-on-surface transition-all active:scale-95 disabled:opacity-60"
          >
            {downloading ? "내려받는 중..." : secondaryLabel}
          </button>
        </div>
        {message && (
          <p className="max-w-sm rounded-xl bg-surface-container-lowest px-4 py-3 text-xs font-semibold text-on-surface-variant">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
