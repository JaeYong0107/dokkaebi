"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/shared/ui/Icon";
import type { Category, Product } from "@/features/product/types";

type Props = {
  mode: "create" | "edit";
  product?: Product;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
};

type FormState = {
  id: string;
  name: string;
  description: string;
  sku: string;
  unit: string;
  basePrice: string;
  normalDiscountRate: string;
  businessDiscountRate: string;
  origin: string;
  imageUrl: string;
  imageEmoji: string;
  imageBg: string;
  badges: string;
  minOrderQty: string;
  stockQuantity: string;
  lowStockThreshold: string;
  isActive: boolean;
  categoryId: string;
};

function defaultsFrom(product: Product | undefined, categories: Category[]): FormState {
  const firstCategoryId =
    categories.find((c) => c.id !== "all")?.id ?? "";
  if (!product) {
    return {
      id: "",
      name: "",
      description: "",
      sku: "",
      unit: "1kg / 봉",
      basePrice: "0",
      normalDiscountRate: "0",
      businessDiscountRate: "0",
      origin: "",
      imageUrl: "",
      imageEmoji: "📦",
      imageBg: "from-slate-200 to-slate-400",
      badges: "",
      minOrderQty: "1",
      stockQuantity: "0",
      lowStockThreshold: "10",
      isActive: true,
      categoryId: firstCategoryId
    };
  }
  // product.category 는 한국어 라벨. categoryId 를 찾으려면 productCategories 매칭
  const matchingCategory = categories.find((c) =>
    c.productCategories?.includes(product.category)
  );
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    sku: product.sku ?? "",
    unit: product.unit,
    basePrice: String(product.basePrice),
    normalDiscountRate: String(product.normalDiscountRate),
    businessDiscountRate: String(product.businessDiscountRate),
    origin: product.origin,
    imageUrl: product.imageUrl ?? "",
    imageEmoji: product.imageEmoji,
    imageBg: product.imageBg,
    badges: (product.badges ?? []).join(", "),
    minOrderQty: "1",
    stockQuantity: String(product.stockQuantity ?? 0),
    lowStockThreshold: String(product.lowStockThreshold ?? 10),
    isActive: product.isActive,
    categoryId: matchingCategory?.id ?? firstCategoryId
  };
}

export function AdminProductForm({
  mode,
  product,
  categories,
  onClose,
  onSuccess
}: Readonly<Props>) {
  const [form, setForm] = useState<FormState>(() =>
    defaultsFrom(product, categories)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...(mode === "create" ? { id: form.id.trim() } : {}),
      name: form.name.trim(),
      description: form.description.trim(),
      sku: form.sku.trim() || null,
      unit: form.unit.trim(),
      basePrice: Number(form.basePrice),
      normalDiscountRate: Number(form.normalDiscountRate),
      businessDiscountRate: Number(form.businessDiscountRate),
      origin: form.origin.trim(),
      imageUrl: form.imageUrl.trim() || null,
      imageEmoji: form.imageEmoji.trim() || null,
      imageBg: form.imageBg.trim() || null,
      badges: form.badges
        .split(",")
        .map((b) => b.trim())
        .filter((b) => b.length > 0),
      minOrderQty: Number(form.minOrderQty) || 1,
      stockQuantity: Number(form.stockQuantity) || 0,
      lowStockThreshold:
        Number.isFinite(Number(form.lowStockThreshold)) &&
        Number(form.lowStockThreshold) >= 0
          ? Number(form.lowStockThreshold)
          : 10,
      isActive: form.isActive,
      categoryId: form.categoryId
    };

    const url =
      mode === "create"
        ? "/api/admin/products"
        : `/api/admin/products/${product!.id}`;

    try {
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(
          body?.message ??
            body?.error?.fieldErrors
              ? Object.values(body.error.fieldErrors).flat().join(", ")
              : "요청 실패"
        );
        return;
      }
      onSuccess();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface-container-lowest p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high"
        >
          <Icon name="close" />
        </button>
        <h2 className="mb-6 font-headline text-2xl font-bold">
          {mode === "create" ? "신규 상품 등록" : "상품 편집"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "create" && (
            <Field label="상품 ID (고유, 영문·숫자·하이픈)">
              <input
                type="text"
                value={form.id}
                onChange={(e) => update("id", e.target.value)}
                placeholder="prod-xxx-001"
                required
                className={inputClass}
              />
            </Field>
          )}
          <Field label="상품명">
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
              className={inputClass}
            />
          </Field>
          <Field label="설명">
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              required
              rows={3}
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="카테고리">
              <select
                value={form.categoryId}
                onChange={(e) => update("categoryId", e.target.value)}
                required
                className={inputClass}
              >
                {categories
                  .filter((c) => c.id !== "all")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="SKU (선택)">
              <input
                type="text"
                value={form.sku}
                onChange={(e) => update("sku", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="단위 (예: 1kg / 봉)">
              <input
                type="text"
                value={form.unit}
                onChange={(e) => update("unit", e.target.value)}
                required
                className={inputClass}
              />
            </Field>
            <Field label="원산지">
              <input
                type="text"
                value={form.origin}
                onChange={(e) => update("origin", e.target.value)}
                required
                className={inputClass}
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="정가 (원)">
              <input
                type="number"
                min="0"
                value={form.basePrice}
                onChange={(e) => update("basePrice", e.target.value)}
                required
                className={inputClass}
              />
            </Field>
            <Field label="일반 할인율 (%)">
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.normalDiscountRate}
                onChange={(e) => update("normalDiscountRate", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="사업자 할인율 (%)">
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.businessDiscountRate}
                onChange={(e) => update("businessDiscountRate", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="재고">
              <input
                type="number"
                min="0"
                value={form.stockQuantity}
                onChange={(e) => update("stockQuantity", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="저재고 알림 기준">
              <input
                type="number"
                min="0"
                value={form.lowStockThreshold}
                onChange={(e) => update("lowStockThreshold", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="최소 주문 수량">
              <input
                type="number"
                min="1"
                value={form.minOrderQty}
                onChange={(e) => update("minOrderQty", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="이미지 URL (선택)">
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="대표 이모지">
              <input
                type="text"
                value={form.imageEmoji}
                onChange={(e) => update("imageEmoji", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="이미지 배경 (Tailwind gradient)">
              <input
                type="text"
                value={form.imageBg}
                onChange={(e) => update("imageBg", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="뱃지 (쉼표 구분)">
            <input
              type="text"
              value={form.badges}
              onChange={(e) => update("badges", e.target.value)}
              placeholder="산지직송, 무농약"
              className={inputClass}
            />
          </Field>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => update("isActive", e.target.checked)}
              className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span className="text-sm font-bold">판매 활성화</span>
          </label>

          {error && (
            <p className="rounded-xl bg-error/10 px-4 py-3 text-xs font-semibold text-error">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary disabled:opacity-50"
            >
              {submitting
                ? "저장 중..."
                : mode === "create"
                  ? "등록"
                  : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-surface-container bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary";

function Field({
  label,
  children
}: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}
