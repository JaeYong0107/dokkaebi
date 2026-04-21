import Link from "next/link";
import type { OrderRecord } from "@/features/order/types";
import { getUnitPrice } from "@/features/pricing/pricing-service";
import type { Product } from "@/features/product/types";
import { serverFetch } from "@/shared/lib/api/server-fetch";
import { Icon } from "@/shared/ui/Icon";
import { FilterToggleCheckbox } from "@/widgets/product-list/FilterToggleCheckbox";
import { ProductGridCard } from "@/widgets/product-list/ProductGridCard";

type Category = {
  id: string;
  name: string;
  icon: string;
  productCategories?: Product["category"][];
};

type SiteContentResponse = {
  catalog: {
    title: string;
    description: string;
    categorySectionTitle: string;
    priceFilterTitle: string;
    highlightOnlyLabel: string;
    freeShippingLabel: string;
    sidebarBanner: {
      eyebrow: string;
      title: string;
      imageUrl: string;
    };
    sortOptions: string[];
    loadMoreLabel: string;
  };
};

type SortKey = "popular" | "price" | "freshness";

const SORT_KEYS: SortKey[] = ["popular", "price", "freshness"];

function isSortKey(value: string | undefined): value is SortKey {
  return value === "popular" || value === "price" || value === "freshness";
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

function isDealProduct(product: Product) {
  return (product.badges ?? []).some(
    (badge) =>
      badge.includes("특가") || badge.includes("단독") || badge.includes("BEST")
  );
}

function isFreeShippingProduct(product: Product) {
  return (product.badges ?? []).some(
    (badge) => badge.includes("도착") || badge.includes("발송")
  );
}

export default function ProductsPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <ProductsPageContent searchParamsPromise={searchParams} />;
}

async function ProductsPageContent({
  searchParamsPromise
}: {
  searchParamsPromise?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = (await searchParamsPromise) ?? {};
  const selectedCategoryId =
    typeof query.category === "string" ? query.category : "all";
  const sortKey: SortKey =
    typeof query.sort === "string" && isSortKey(query.sort)
      ? query.sort
      : "popular";
  const dealsOnly = query.dealsOnly === "1";
  const freeShippingOnly = query.freeShipping === "1";

  const [productsResponse, categoriesResponse, ordersResponse, contentResponse] =
    await Promise.all([
      serverFetch("/api/products"),
      serverFetch("/api/categories"),
      serverFetch("/api/orders"),
      serverFetch("/api/site-content")
    ]);

  const productsData = (await productsResponse.json()) as { items: Product[] };
  const categoriesData = (await categoriesResponse.json()) as {
    items: Category[];
  };
  const ordersData = (await ordersResponse.json()) as { items: OrderRecord[] };
  const content = (await contentResponse.json()) as SiteContentResponse;

  const activeProducts = productsData.items.filter((product) => product.isActive);
  const selectedCategory = categoriesData.items.find(
    (category) => category.id === selectedCategoryId
  );

  const orderCountByProductId = ordersData.items.reduce<Record<string, number>>(
    (acc, order) => {
      order.items.forEach((item) => {
        acc[item.productId] = (acc[item.productId] ?? 0) + item.quantity;
      });
      return acc;
    },
    {}
  );

  // 1) 카테고리 필터
  let filteredProducts =
    selectedCategory && selectedCategory.id !== "all"
      ? activeProducts.filter((product) =>
          selectedCategory.productCategories?.includes(product.category)
        )
      : activeProducts;

  // 2) 부가 필터 (사업자 특가/배송 보장)
  if (dealsOnly) {
    filteredProducts = filteredProducts.filter(isDealProduct);
  }
  if (freeShippingOnly) {
    filteredProducts = filteredProducts.filter(isFreeShippingProduct);
  }

  // 3) 정렬
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortKey === "price") {
      return getUnitPrice(a, "BUSINESS") - getUnitPrice(b, "BUSINESS");
    }
    if (sortKey === "freshness") {
      // mock 상 stockQuantity 미보유 → id 역순으로 "신상" 근사
      return b.id.localeCompare(a.id);
    }
    return (
      (orderCountByProductId[b.id] ?? 0) - (orderCountByProductId[a.id] ?? 0)
    );
  });

  const visibleProducts = sortedProducts.slice(0, 12);

  const categoryItems = categoriesData.items.map((category) => {
    const baseList =
      category.id === "all"
        ? activeProducts
        : activeProducts.filter((product) =>
            category.productCategories?.includes(product.category)
          );
    let count = baseList.length;
    if (dealsOnly) count = baseList.filter(isDealProduct).length;
    if (freeShippingOnly)
      count = baseList.filter(isFreeShippingProduct).length;
    return {
      ...category,
      count,
      active: category.id === (selectedCategory?.id ?? "all")
    };
  });

  const sortLabels = content.catalog.sortOptions;
  const sortItems = SORT_KEYS.map((key, index) => ({
    key,
    label: sortLabels[index] ?? key,
    active: key === sortKey
  }));

  const sidebarTitleLines = content.catalog.sidebarBanner.title.split("\n");

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12 md:flex-row">
      <aside className="w-full shrink-0 space-y-10 md:w-64">
        <div>
          <h3 className="mb-6 font-headline text-xl font-extrabold tracking-tight">
            {content.catalog.categorySectionTitle}
          </h3>
          <ul className="space-y-3">
            {categoryItems.map((category) => (
              <li key={category.id}>
                <Link
                  href={buildHref("/products", query, {
                    category: category.id === "all" ? undefined : category.id
                  })}
                  className={
                    category.active
                      ? "group flex items-center justify-between font-bold text-primary"
                      : "flex items-center justify-between text-on-surface-variant transition-colors hover:text-primary"
                  }
                >
                  <span>{category.name}</span>
                  <span
                    className={
                      category.active
                        ? "text-xs opacity-40 group-hover:opacity-100"
                        : "text-xs opacity-40"
                    }
                  >
                    {category.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6 rounded-[2rem] bg-surface-container-low p-6">
          <h3 className="font-headline text-lg font-bold tracking-tight">
            {content.catalog.priceFilterTitle}
          </h3>
          <div className="space-y-4">
            <div className="relative h-1 rounded-full bg-surface-container-highest">
              <div className="absolute inset-y-0 left-1/4 right-1/4 rounded-full bg-primary" />
              <div className="absolute left-1/4 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-primary bg-white shadow-sm" />
              <div className="absolute right-1/4 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-primary bg-white shadow-sm" />
            </div>
            <div className="flex justify-between text-xs font-bold text-on-surface-variant">
              <span>10,000원</span>
              <span>50,000원</span>
            </div>
          </div>
          <div className="space-y-2">
            <FilterToggleCheckbox
              paramKey="dealsOnly"
              label={content.catalog.highlightOnlyLabel}
            />
            <FilterToggleCheckbox
              paramKey="freeShipping"
              label={content.catalog.freeShippingLabel}
            />
          </div>
        </div>

        <div className="group relative aspect-[3/4] overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.catalog.sidebarBanner.imageUrl}
            alt="Fresh Produce"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/90 to-transparent p-6">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/80">
              {content.catalog.sidebarBanner.eyebrow}
            </p>
            <h4 className="font-headline text-xl font-extrabold leading-tight text-white">
              {sidebarTitleLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </h4>
          </div>
        </div>
      </aside>

      <section className="flex-1">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 font-headline text-4xl font-black tracking-tighter text-primary">
              {selectedCategory?.name ?? content.catalog.title}
            </h2>
            <p className="font-medium text-on-surface-variant">
              {content.catalog.description}
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm font-bold text-on-surface-variant">
            {sortItems.map((option) => (
              <Link
                key={option.key}
                href={buildHref("/products", query, {
                  sort: option.key === "popular" ? undefined : option.key
                })}
                className={
                  option.active
                    ? "border-b-2 border-primary pb-1 text-primary"
                    : "border-b-2 border-transparent pb-1 transition-colors hover:text-primary"
                }
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-outline-variant/40 bg-surface-container-low p-16 text-center text-sm text-on-surface-variant">
            선택한 조건에 맞는 상품이 없습니다. 필터를 조정해 보세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product, index) => (
              <ProductGridCard
                key={product.id}
                product={product}
                index={index}
                highlightFirst={sortKey === "popular"}
              />
            ))}
          </div>
        )}

        {sortedProducts.length > 0 && (
          <div className="mt-20 flex justify-center">
            <button className="group flex items-center gap-4 rounded-full border border-stone-100 bg-white px-8 py-4 shadow-sm transition-all hover:border-primary">
              <span className="font-bold text-on-surface">
                {content.catalog.loadMoreLabel} ({visibleProducts.length} / {sortedProducts.length})
              </span>
              <Icon
                name="expand_more"
                className="text-primary transition-transform group-hover:translate-y-1"
              />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
