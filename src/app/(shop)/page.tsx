import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { BusinessCtaButtons } from "@/widgets/home-business-cta/BusinessCtaButtons";
import type { OrderRecord } from "@/features/order/types";
import { getUnitPrice } from "@/features/pricing/pricing-service";
import type { Product } from "@/features/product/types";
import { serverFetch } from "@/shared/lib/api/server-fetch";
import { formatCurrency } from "@/shared/lib/format";
import { Icon } from "@/shared/ui/Icon";

type Category = {
  id: string;
  name: string;
  icon: string;
  featured?: boolean;
};

type SiteContentResponse = {
  home: {
    hero: {
      eyebrow: string;
      title: string;
      ctaLabel: string;
      imageUrl: string;
    };
    quickReorder: {
      title: string;
      ctaLabel: string;
    };
    popularSection: {
      title: string;
      description: string;
    };
    categorySection: {
      title: string;
    };
    businessCta: {
      title: string;
      description: string;
      primaryActionLabel: string;
      secondaryActionLabel: string;
    };
  };
};

function getBadgeTone(label: string) {
  if (label.includes("BEST")) {
    return "bg-secondary-container text-on-secondary-container";
  }

  if (label.includes("신선")) {
    return "bg-primary-container text-on-primary-container";
  }

  return "bg-tertiary-fixed text-on-tertiary-fixed-variant";
}

export default async function HomePage() {
  const [
    productsResponse,
    ordersResponse,
    categoriesResponse,
    contentResponse,
  ] = await Promise.all([
    serverFetch("/api/products"),
    serverFetch("/api/orders"),
    serverFetch("/api/categories"),
    serverFetch("/api/site-content"),
  ]);

  const productsData = (await productsResponse.json()) as { items: Product[] };
  const ordersData = (await ordersResponse.json()) as { items: OrderRecord[] };
  const categoriesData = (await categoriesResponse.json()) as {
    items: Category[];
  };
  const content = (await contentResponse.json()) as SiteContentResponse;

  const productsById = Object.fromEntries(
    productsData.items.map((product) => [product.id, product]),
  );
  const activeProducts = productsData.items.filter(
    (product) => product.isActive,
  );
  const orderCountByProductId = ordersData.items?.reduce<
    Record<string, number>
  >((acc, order) => {
    order.items.forEach((item) => {
      acc[item.productId] = (acc[item.productId] ?? 0) + item.quantity;
    });
    return acc;
  }, {});
  const rankedProducts = [...activeProducts].sort(
    (a, b) =>
      (orderCountByProductId[b.id] ?? 0) - (orderCountByProductId[a.id] ?? 0),
  );
  const popularProducts = (
    rankedProducts.length > 0 ? rankedProducts : activeProducts
  )
    .slice(0, 5)
    .map((product) => ({
      ...product,
      price: getUnitPrice(product, "BUSINESS"),
      primaryBadge: product.badges?.[0] ?? null,
      secondaryBadge:
        product.businessDiscountRate > 0
          ? `사업자 ${product.businessDiscountRate}% 할인`
          : null,
    }));

  const latestOrder = ordersData.items[0];
  const quickReorderItems =
    latestOrder?.items.map((item) => {
      const product = productsById[item.productId];
      return {
        productId: item.productId,
        name: product?.name ?? item.productName,
        meta: `${formatCurrency(item.unitPrice)} · ${item.quantity}개`,
        imageUrl: product?.imageUrl,
        imageEmoji: product?.imageEmoji ?? item.imageEmoji,
        imageBg: product?.imageBg ?? item.imageBg,
      };
    }) ?? [];

  const featuredCategories = categoriesData.items.filter(
    (category) => category.featured,
  );
  const heroTitleLines = content.home.hero.title.split("\n");

  return (
    <main className="mx-auto w-full max-w-7xl px-6">
      {/* Hero Section & Quick Reorder (Bento Style) */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Left: Hero Banner */}
        <div className="group relative flex h-[400px] items-center overflow-hidden rounded-[2rem] bg-primary p-12 md:col-span-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.home.hero.imageUrl}
            alt="신선한 농산물"
            className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
          />
          <div className="relative z-10 max-w-lg">
            <span className="mb-4 inline-block rounded-full bg-secondary-container px-4 py-1.5 text-xs font-bold text-on-secondary-container">
              {content.home.hero.eyebrow}
            </span>
            <h1 className="mb-6 font-headline text-3xl font-extrabold leading-[1.1] tracking-tighter text-white sm:text-4xl md:text-5xl">
              {heroTitleLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </h1>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-4 font-bold text-on-secondary transition-all hover:brightness-110 active:scale-95"
            >
              {content.home.hero.ctaLabel}
              <Icon name="trending_flat" />
            </Link>
          </div>
        </div>

        {/* Right: Quick Reorder Widget */}
        <div className="flex flex-col justify-between rounded-[2rem] bg-surface-container-lowest p-8 shadow-ambient md:col-span-4">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-headline text-xl font-bold tracking-tight">
                {content.home.quickReorder.title}
              </h2>
              <Icon name="history" className="text-stone-400" />
            </div>
            <div className="mb-8 space-y-4">
              {quickReorderItems.map((item) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-xl bg-surface-container-low">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${item.imageBg}`}
                      >
                        <span className="text-xl">{item.imageEmoji}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-stone-500">{item.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1 text-sm font-medium">
              <span className="text-stone-500">
                총 {quickReorderItems.length}개 품목
              </span>
              <span className="font-bold text-primary">
                {formatCurrency(latestOrder?.total ?? 0)}
              </span>
            </div>
            <Link
              href="/reorder"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-4 font-bold text-on-secondary shadow-lg shadow-secondary/20 transition-all hover:brightness-110 active:scale-95"
            >
              <Icon name="shopping_cart_checkout" />
              {content.home.quickReorder.ctaLabel}
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Section */}
      <section className="mb-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="mb-2 font-headline text-3xl font-extrabold tracking-tight">
              {content.home.popularSection.title}
            </h2>
            <p className="text-sm text-stone-500">
              {content.home.popularSection.description}
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-bold text-stone-400 transition-colors hover:text-primary"
          >
            전체보기
            <Icon name="chevron_right" className="text-[18px]" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
          {popularProducts.map((product) => (
            <article
              key={product.id}
              className="group relative rounded-[1.5rem] bg-surface-container-lowest p-4 transition-all hover:shadow-xl hover:shadow-stone-200/50"
            >
              <Link
                href={`/products/${product.id}`}
                aria-label={`${product.name} 상세 보기`}
                className="absolute inset-0 z-10 rounded-[1.5rem]"
              />
              <div className="pointer-events-none relative z-0 mb-4 aspect-square overflow-hidden rounded-xl bg-surface-container-low">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.primaryBadge && (
                  <div
                    className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-bold ${getBadgeTone(product.primaryBadge)}`}
                  >
                    {product.primaryBadge}
                  </div>
                )}
              </div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                {product.category}
              </p>
              <h3 className="mb-2 line-clamp-1 text-sm font-bold text-on-surface transition-colors group-hover:text-primary">
                {product.name}
              </h3>
              <div className="mb-3 flex items-center gap-2">
                <span className="font-headline text-lg font-extrabold tracking-tight text-primary">
                  {formatCurrency(product.price)}
                </span>
                {product.secondaryBadge && (
                  <div className="rounded bg-tertiary-fixed px-1.5 py-0.5 text-[10px] font-bold text-on-tertiary-fixed-variant">
                    {product.secondaryBadge}
                  </div>
                )}
              </div>
              <div className="relative z-20">
                <AddToCartButton
                  productId={product.id}
                  className="w-full rounded-full border border-stone-100 py-2.5 text-xs font-bold hover:bg-stone-50"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Categories Shortcut */}
      <section className="mb-20">
        <h2 className="mb-8 font-headline text-xl font-bold tracking-tight">
          {content.home.categorySection.title}
        </h2>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6 lg:grid-cols-9">
          {featuredCategories.map((category) => (
            <Link
              key={category.id}
              href={
                category.id === "all"
                  ? "/products"
                  : `/products?category=${category.id}`
              }
              className="group flex cursor-pointer flex-col items-center gap-3"
            >
              <div className="flex aspect-square w-full items-center justify-center rounded-[1.5rem] bg-stone-100 transition-all group-hover:bg-primary-container group-hover:text-on-primary-container">
                <Icon name={category.icon} className="text-3xl" />
              </div>
              <span className="text-xs font-bold">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter / Business Trust */}
      <section className="mb-16 flex flex-col items-center justify-between gap-8 rounded-[2rem] bg-surface-container-highest p-12 md:flex-row">
        <div className="max-w-xl text-center md:text-left">
          <h2 className="mb-4 font-headline text-2xl font-extrabold tracking-tight">
            {content.home.businessCta.title}
          </h2>
          <p className="text-stone-600">
            {content.home.businessCta.description}
          </p>
        </div>
        <BusinessCtaButtons
          primaryLabel={content.home.businessCta.primaryActionLabel}
          secondaryLabel={content.home.businessCta.secondaryActionLabel}
        />
      </section>
    </main>
  );
}
