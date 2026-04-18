import Link from "next/link";
import { ProductCardActions } from "@/components/cart/ProductCardActions";
import type { OrderRecord } from "@/features/order/types";
import { getOriginalPrice, getUnitPrice } from "@/features/pricing/pricing-service";
import type { Product } from "@/features/product/types";
import { getServerOrigin } from "@/shared/lib/api/server-origin";
import { formatCurrency } from "@/shared/lib/format";
import { Icon } from "@/shared/ui/Icon";

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

export default function ProductsPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const originPromise = getServerOrigin();

  return (
    <ProductsPageContent
      originPromise={originPromise}
      searchParamsPromise={searchParams}
    />
  );
}

async function ProductsPageContent({
  originPromise,
  searchParamsPromise
}: {
  originPromise: Promise<string>;
  searchParamsPromise?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const origin = await originPromise;
  const query = (await searchParamsPromise) ?? {};
  const selectedCategoryId =
    typeof query.category === "string" ? query.category : "all";

  const [productsResponse, categoriesResponse, ordersResponse, contentResponse] =
    await Promise.all([
      fetch(`${origin}/api/products`, { cache: "no-store" }),
      fetch(`${origin}/api/categories`, { cache: "no-store" }),
      fetch(`${origin}/api/orders`, { cache: "no-store" }),
      fetch(`${origin}/api/site-content`, { cache: "no-store" })
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

  const filteredProducts =
    selectedCategory && selectedCategory.id !== "all"
      ? activeProducts.filter((product) =>
          selectedCategory.productCategories?.includes(product.category)
        )
      : activeProducts;

  const categoryItems = categoriesData.items.map((category) => {
    const count =
      category.id === "all"
        ? activeProducts.length
        : activeProducts.filter((product) =>
            category.productCategories?.includes(product.category)
          ).length;

    return {
      ...category,
      count,
      active: category.id === (selectedCategory?.id ?? "all")
    };
  });

  const orderCountByProductId = ordersData.items.reduce<Record<string, number>>(
    (acc, order) => {
      order.items.forEach((item) => {
        acc[item.productId] = (acc[item.productId] ?? 0) + item.quantity;
      });
      return acc;
    },
    {}
  );

  const products = [...filteredProducts].sort(
    (a, b) => (orderCountByProductId[b.id] ?? 0) - (orderCountByProductId[a.id] ?? 0)
  );
  const visibleProducts = products.slice(0, 12);
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
                  href={
                    category.id === "all"
                      ? "/products"
                      : `/products?category=${category.id}`
                  }
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
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 rounded-md border-outline-variant text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">
                {content.catalog.highlightOnlyLabel}
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 rounded-md border-outline-variant text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">
                {content.catalog.freeShippingLabel}
              </span>
            </label>
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
            {content.catalog.sortOptions.map((option, index) => (
              <button
                key={option}
                className={
                  index === 0
                    ? "border-b-2 border-primary pb-1 text-primary"
                    : "border-b-2 border-transparent pb-1 transition-colors hover:text-primary"
                }
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product, index) => (
            <article key={product.id} className="group relative">
              <Link
                href={`/products/${product.id}`}
                aria-label={`${product.name} 상세 보기`}
                className="absolute inset-0 z-10 rounded-[2.5rem]"
              />
              <div className="pointer-events-none relative z-0 mb-6 aspect-square overflow-hidden rounded-[2.5rem] bg-surface-container-low">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4">
                  {(product.badges ?? []).map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full bg-tertiary px-3 py-1 text-[10px] font-black tracking-tighter text-white shadow-lg"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                {index === 0 ? (
                  <div className="absolute right-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-black tracking-tighter text-white">
                    BEST
                  </div>
                ) : null}
              </div>
              {index === 0 ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-[8.5rem] right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-primary shadow-xl backdrop-blur"
                >
                  <Icon name="favorite" />
                </span>
              ) : null}
              <div className="space-y-1 px-2">
                <p className="text-xs font-bold text-stone-400">
                  {product.origin}
                </p>
                <h3 className="truncate font-headline text-lg font-bold text-on-surface transition-colors group-hover:text-primary">
                  {product.name}
                </h3>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-sm text-stone-400 line-through">
                    {formatCurrency(getOriginalPrice(product))}
                  </span>
                  <span className="font-headline text-xl font-extrabold text-primary">
                    {formatCurrency(getUnitPrice(product, "BUSINESS"))}
                  </span>
                </div>
                <div className="relative z-20">
                  <ProductCardActions productId={product.id} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <button className="group flex items-center gap-4 rounded-full border border-stone-100 bg-white px-8 py-4 shadow-sm transition-all hover:border-primary">
            <span className="font-bold text-on-surface">
              {content.catalog.loadMoreLabel} ({visibleProducts.length} / {products.length})
            </span>
            <Icon
              name="expand_more"
              className="text-primary transition-transform group-hover:translate-y-1"
            />
          </button>
        </div>
      </section>
    </main>
  );
}
