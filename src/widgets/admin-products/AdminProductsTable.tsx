"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Icon } from "@/shared/ui/Icon";
import type { Category, Product } from "@/features/product/types";
import { AdminProductForm } from "./AdminProductForm";

type Props = {
  products: Product[];
  categories: Category[];
};

async function toggleActive(id: string, isActive: boolean) {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive })
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? "요청 실패");
  }
}

export function AdminProductsTable({ products, categories }: Readonly<Props>) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [actingId, setActingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => startTransition(() => router.refresh());

  const onToggle = (product: Product) => {
    setActingId(product.id);
    setError(null);
    toggleActive(product.id, !product.isActive)
      .then(refresh)
      .catch((e: Error) => setError(e.message))
      .finally(() => setActingId(null));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">
          전체 {products.length}건
        </p>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary"
        >
          <Icon name="add" className="text-base" />
          신규 상품 등록
        </button>
      </div>
      {error && (
        <p className="rounded-xl bg-error/10 px-4 py-3 text-xs font-semibold text-error">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-surface-container bg-surface-container-lowest">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-surface-container-low text-xs font-bold text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 text-left">ID / SKU</th>
              <th className="px-4 py-3 text-left">상품명</th>
              <th className="px-4 py-3 text-left">카테고리</th>
              <th className="px-4 py-3 text-right">정가</th>
              <th className="px-4 py-3 text-right">재고</th>
              <th className="px-4 py-3 text-left">상태</th>
              <th className="px-4 py-3 text-right">액션</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-on-surface-variant"
                >
                  조건에 맞는 상품이 없습니다.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const busy =
                  (actingId === product.id && pending === false
                    ? false
                    : actingId === product.id) || pending;
                return (
                  <tr
                    key={product.id}
                    className="border-t border-surface-container hover:bg-surface-container-low/40"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      <div>{product.id}</div>
                      {product.sku && (
                        <div className="text-on-surface-variant">
                          SKU: {product.sku}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-xs text-on-surface-variant">
                        {product.unit} · {product.origin}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-bold text-on-surface-variant">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {product.basePrice.toLocaleString("ko-KR")}원
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {product.stockQuantity ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      {product.isActive ? (
                        <span className="inline-flex items-center gap-1 text-primary">
                          <Icon name="check_circle" className="text-base" />
                          <span className="text-xs font-bold">판매중</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-on-surface-variant">
                          <Icon name="pause_circle" className="text-base" />
                          <span className="text-xs font-bold">중지</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditing(product)}
                          className="rounded-full border border-outline-variant px-3 py-1 text-xs font-bold text-on-surface-variant hover:bg-surface-container-high"
                        >
                          편집
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onToggle(product)}
                          className="rounded-full border border-primary px-3 py-1 text-xs font-bold text-primary hover:bg-primary/10 disabled:opacity-40"
                        >
                          {product.isActive ? "중지" : "판매 재개"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {creating && (
        <AdminProductForm
          mode="create"
          categories={categories}
          onClose={() => setCreating(false)}
          onSuccess={() => {
            setCreating(false);
            refresh();
          }}
        />
      )}
      {editing && (
        <AdminProductForm
          mode="edit"
          product={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}
