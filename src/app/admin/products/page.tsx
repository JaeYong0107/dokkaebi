import { headers } from "next/headers";
import Link from "next/link";
import { getServerOrigin } from "@/shared/lib/api/server-origin";
import type { Category, Product } from "@/features/product/types";
import { AdminProductsTable } from "@/widgets/admin-products/AdminProductsTable";

type ActiveFilter = "ALL" | "ACTIVE" | "INACTIVE";

const ACTIVE_FILTERS: Array<{ key: ActiveFilter; label: string }> = [
  { key: "ALL", label: "전체" },
  { key: "ACTIVE", label: "판매중" },
  { key: "INACTIVE", label: "중지" }
];

function isActiveFilter(value: string | undefined): value is ActiveFilter {
  return ACTIVE_FILTERS.some((f) => f.key === value);
}

function buildHref(
  base: string,
  current: Record<string, string | string[] | undefined>,
  updates: Record<string, string | undefined>
) {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) {
    if (typeof v === "string" && v.length > 0) next.set(k, v);
  }
  for (const [k, v] of Object.entries(updates)) {
    if (v === undefined) next.delete(k);
    else next.set(k, v);
  }
  const qs = next.toString();
  return qs ? `${base}?${qs}` : base;
}

export default async function AdminProductsPage({
  searchParams
}: Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const origin = await getServerOrigin();
  const hdrs = await headers();
  const cookie = hdrs.get("cookie") ?? "";
  const query = (await searchParams) ?? {};
  const activeFilter: ActiveFilter =
    typeof query.active === "string" && isActiveFilter(query.active)
      ? query.active
      : "ALL";
  const categoryFilter =
    typeof query.category === "string" ? query.category : "";
  const keyword =
    typeof query.q === "string" ? query.q.trim().toLowerCase() : "";

  const [productsResponse, categoriesResponse] = await Promise.all([
    fetch(`${origin}/api/admin/products`, {
      cache: "no-store",
      headers: { cookie }
    }),
    fetch(`${origin}/api/categories`, { cache: "no-store" })
  ]);

  if (!productsResponse.ok) {
    return (
      <div className="rounded-xl bg-error/10 px-6 py-8 text-sm font-semibold text-error">
        상품 목록을 불러오지 못했습니다.
      </div>
    );
  }

  const productsData = (await productsResponse.json()) as { items: Product[] };
  const categoriesData = (await categoriesResponse.json()) as {
    items: Category[];
  };

  const all = productsData.items;
  const filtered = all
    .filter((p) => {
      if (activeFilter === "ALL") return true;
      return activeFilter === "ACTIVE" ? p.isActive : !p.isActive;
    })
    .filter((p) => {
      if (!categoryFilter) return true;
      const cat = categoriesData.items.find((c) => c.id === categoryFilter);
      if (!cat) return true;
      return (cat.productCategories ?? []).includes(p.category);
    })
    .filter((p) => {
      if (!keyword) return true;
      return (
        p.name.toLowerCase().includes(keyword) ||
        p.id.toLowerCase().includes(keyword) ||
        (p.sku ?? "").toLowerCase().includes(keyword) ||
        p.origin.toLowerCase().includes(keyword)
      );
    });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-2xl font-bold">상품 관리</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          상품 등록 · 수정 · 판매 상태 관리
        </p>
      </header>

      <form
        action="/admin/products"
        method="get"
        className="flex flex-wrap items-center gap-3"
      >
        <input
          type="text"
          name="q"
          defaultValue={typeof query.q === "string" ? query.q : ""}
          placeholder="상품명 / ID / SKU / 원산지 검색"
          className="flex-1 min-w-[240px] rounded-xl border border-surface-container bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        {activeFilter !== "ALL" && (
          <input type="hidden" name="active" value={activeFilter} />
        )}
        {categoryFilter && (
          <input type="hidden" name="category" value={categoryFilter} />
        )}
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary"
        >
          검색
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <span className="mr-2 self-center text-xs font-bold text-on-surface-variant">
          상태
        </span>
        {ACTIVE_FILTERS.map((f) => (
          <Link
            key={f.key}
            href={buildHref("/admin/products", query, {
              active: f.key === "ALL" ? undefined : f.key
            })}
            className={
              f.key === activeFilter
                ? "rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-on-primary"
                : "rounded-full bg-surface-container-high px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-highest"
            }
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="mr-2 self-center text-xs font-bold text-on-surface-variant">
          카테고리
        </span>
        <Link
          href={buildHref("/admin/products", query, { category: undefined })}
          className={
            categoryFilter === ""
              ? "rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-on-primary"
              : "rounded-full bg-surface-container-high px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-highest"
          }
        >
          전체
        </Link>
        {categoriesData.items
          .filter((c) => c.id !== "all")
          .map((c) => (
            <Link
              key={c.id}
              href={buildHref("/admin/products", query, { category: c.id })}
              className={
                c.id === categoryFilter
                  ? "rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-on-primary"
                  : "rounded-full bg-surface-container-high px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-highest"
              }
            >
              {c.name}
            </Link>
          ))}
      </div>

      <AdminProductsTable
        products={filtered}
        categories={categoriesData.items}
      />
    </div>
  );
}
