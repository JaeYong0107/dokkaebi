"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/ui/Icon";

type CategoryItem = {
  id: string;
  name: string;
  count: number;
  active: boolean;
  href: string;
};

type SortItem = {
  key: string;
  label: string;
  active: boolean;
  href: string;
};

type Props = {
  categories: CategoryItem[];
  sorts: SortItem[];
  dealsOnly: boolean;
  freeShippingOnly: boolean;
  dealsHref: string;
  freeShippingHref: string;
};

type DropdownKind = "category" | "sort" | "filter" | null;

export function MobileProductsFilterBar({
  categories,
  sorts,
  dealsOnly,
  freeShippingOnly,
  dealsHref,
  freeShippingHref
}: Readonly<Props>) {
  const [open, setOpen] = useState<DropdownKind>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const activeCategory =
    categories.find((category) => category.active) ?? categories[0];
  const activeSort = sorts.find((sort) => sort.active) ?? sorts[0];
  const otherFilterCount =
    (dealsOnly ? 1 : 0) + (freeShippingOnly ? 1 : 0);

  const toggle = (kind: DropdownKind) =>
    setOpen((prev) => (prev === kind ? null : kind));

  return (
    <div
      ref={rootRef}
      className="sticky top-0 z-30 -mx-6 border-b border-surface-container bg-surface-container-lowest md:hidden"
    >
      <div className="flex items-center gap-2 px-4 py-2.5">
        <FilterChip
          label={`${activeCategory?.name ?? "전체"} ${activeCategory?.count ?? 0}`}
          icon="grid_view"
          open={open === "category"}
          onClick={() => toggle("category")}
        />
        <FilterChip
          label={activeSort?.label ?? "인기순"}
          icon="swap_vert"
          open={open === "sort"}
          onClick={() => toggle("sort")}
        />
        <button
          type="button"
          onClick={() => toggle("filter")}
          aria-label="상세 필터"
          aria-expanded={open === "filter"}
          className={
            open === "filter"
              ? "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container"
              : "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-on-surface"
          }
        >
          <Icon name="tune" className="text-base" />
          {otherFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-on-primary">
              {otherFilterCount}
            </span>
          )}
        </button>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full max-h-[60vh] overflow-y-auto border-b border-surface-container bg-surface-container-lowest p-4 shadow-lg">
          {open === "category" && (
            <CategoryPanel
              items={categories}
              onPick={() => setOpen(null)}
            />
          )}
          {open === "sort" && (
            <SortPanel items={sorts} onPick={() => setOpen(null)} />
          )}
          {open === "filter" && (
            <FilterPanel
              dealsOnly={dealsOnly}
              freeShippingOnly={freeShippingOnly}
              dealsHref={dealsHref}
              freeShippingHref={freeShippingHref}
              onPick={() => setOpen(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  icon,
  open,
  onClick
}: Readonly<{
  label: string;
  icon: string;
  open: boolean;
  onClick: () => void;
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={
        open
          ? "flex h-9 max-w-[45%] flex-1 items-center gap-1 rounded-full bg-primary-container px-3 text-sm font-semibold text-on-primary-container"
          : "flex h-9 max-w-[45%] flex-1 items-center gap-1 rounded-full bg-surface-container-high px-3 text-sm font-semibold text-on-surface"
      }
    >
      <Icon
        name={icon}
        className={
          open
            ? "text-base text-on-primary-container"
            : "text-base text-on-surface-variant"
        }
      />
      <span className="truncate">{label}</span>
      <Icon
        name="expand_more"
        className={
          open
            ? "ml-auto rotate-180 text-base text-on-primary-container transition-transform"
            : "ml-auto text-base text-on-surface-variant transition-transform"
        }
      />
    </button>
  );
}

function CategoryPanel({
  items,
  onPick
}: Readonly<{
  items: CategoryItem[];
  onPick: () => void;
}>) {
  return (
    <ul className="space-y-1">
      {items.map((category) => (
        <li key={category.id}>
          <Link
            href={category.href}
            onClick={onPick}
            className={
              category.active
                ? "flex items-center justify-between rounded-xl bg-primary-container px-4 py-3 text-sm font-bold text-on-primary-container"
                : "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container-low"
            }
          >
            <span>{category.name}</span>
            <span
              className={
                category.active
                  ? "text-xs text-on-primary-container/70"
                  : "text-xs text-on-surface-variant"
              }
            >
              {category.count}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SortPanel({
  items,
  onPick
}: Readonly<{
  items: SortItem[];
  onPick: () => void;
}>) {
  return (
    <ul className="space-y-1">
      {items.map((sort) => (
        <li key={sort.key}>
          <Link
            href={sort.href}
            onClick={onPick}
            className={
              sort.active
                ? "flex items-center justify-between rounded-xl bg-primary-container px-4 py-3 text-sm font-bold text-on-primary-container"
                : "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container-low"
            }
          >
            <span>{sort.label}</span>
            {sort.active && <Icon name="check" className="text-base" />}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FilterPanel({
  dealsOnly,
  freeShippingOnly,
  dealsHref,
  freeShippingHref,
  onPick
}: Readonly<{
  dealsOnly: boolean;
  freeShippingOnly: boolean;
  dealsHref: string;
  freeShippingHref: string;
  onPick: () => void;
}>) {
  return (
    <div className="space-y-2">
      <Link
        href={dealsHref}
        onClick={onPick}
        className={
          dealsOnly
            ? "flex items-center justify-between rounded-xl bg-primary-container px-4 py-3 text-sm font-bold text-on-primary-container"
            : "flex items-center justify-between rounded-xl border border-surface-container px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container-low"
        }
      >
        <span className="flex items-center gap-2">
          <Icon name="local_fire_department" className="text-base" />
          사업자 특가 상품만
        </span>
        {dealsOnly && <Icon name="check" className="text-base" />}
      </Link>
      <Link
        href={freeShippingHref}
        onClick={onPick}
        className={
          freeShippingOnly
            ? "flex items-center justify-between rounded-xl bg-primary-container px-4 py-3 text-sm font-bold text-on-primary-container"
            : "flex items-center justify-between rounded-xl border border-surface-container px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container-low"
        }
      >
        <span className="flex items-center gap-2">
          <Icon name="local_shipping" className="text-base" />
          무료배송 / 당일 발송만
        </span>
        {freeShippingOnly && <Icon name="check" className="text-base" />}
      </Link>
    </div>
  );
}
