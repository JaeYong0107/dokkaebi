import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailActions } from "@/components/cart/ProductDetailActions";
import { ProductImage } from "@/entities/product/ui/ProductImage";
import type { Product } from "@/features/product/types";
import {
  getDiscountRate,
  getOriginalPrice,
  getUnitPrice
} from "@/features/pricing/pricing-service";
import { getServerOrigin } from "@/shared/lib/api/server-origin";
import { formatCurrency } from "@/shared/lib/format";
import { Icon } from "@/shared/ui/Icon";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ProductDetailContentResponse = {
  seriesLabel: string;
  businessPriceHint: string;
  shippingCardLabel: string;
  shippingLeadLabel: string;
  shippingLeadHighlight: string;
  originCardLabel: string;
  tabs: string[];
  policySections: Array<{
    title: string;
    items: string[];
  }>;
  recommendationTitle: string;
  quickReorderLabel: string;
  quickReorderDescription: string;
  quickReorderActionLabel: string;
  sections: {
    origin: string;
    metrics: string;
    nutrition: string;
  };
  metrics: Array<{
    label: string;
    value: string;
    percent: number;
  }>;
  nutrition: Array<{
    label: string;
    value: string;
  }>;
};

export default async function ProductDetailPage({
  params
}: ProductDetailPageProps) {
  const { id } = await params;
  const origin = await getServerOrigin();
  const [productsResponse, contentResponse] = await Promise.all([
    fetch(`${origin}/api/products`, {
      cache: "no-store"
    }),
    fetch(`${origin}/api/products/${id}/content`, {
      cache: "no-store"
    })
  ]);
  const productsData = (await productsResponse.json()) as { items: Product[] };
  const content = (await contentResponse.json()) as ProductDetailContentResponse;
  const sampleProducts = productsData.items;
  const product = sampleProducts.find((candidate) => candidate.id === id) ?? null;

  if (!product || !product.isActive) {
    notFound();
  }

  const recommendations = sampleProducts
    .filter((candidate) => candidate.isActive)
    .filter((candidate) => candidate.id !== product.id)
    .slice(0, 3);
  const originalPrice = getOriginalPrice(product);
  const normalPrice = getUnitPrice(product, "NORMAL");
  const businessPrice = getUnitPrice(product, "BUSINESS");
  const normalDiscount = getDiscountRate(product, "NORMAL");
  const businessDiscount = getDiscountRate(product, "BUSINESS");
  const quickReorderProducts = sampleProducts
    .filter((candidate) => candidate.isActive)
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-screen-2xl px-8 py-12">
      <nav className="mb-8 flex items-center space-x-2 text-sm text-on-surface-variant">
        <Link href="/" className="hover:text-primary">
          홈
        </Link>
        <Icon name="chevron_right" className="text-xs" />
        <Link href="/products" className="hover:text-primary">
          {product.category}
        </Link>
        <Icon name="chevron_right" className="text-xs" />
        <span className="font-bold text-primary">{product.name}</span>
      </nav>

      <div className="mb-20 grid grid-cols-12 gap-12">
        <div className="col-span-12 flex gap-4 lg:col-span-7">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`${product.id}-${idx}`}
                className={
                  "h-20 w-20 overflow-hidden rounded-xl bg-surface-container-high p-2 transition-all ring-primary" +
                  (idx === 0 ? " ring-2" : "")
                }
              >
                <ProductImage
                  imageUrl={product.imageUrl}
                  alt={product.name}
                  emoji={product.imageEmoji}
                  bg={product.imageBg}
                  size="md"
                />
              </div>
            ))}
          </div>
          <div className="flex-1 overflow-hidden rounded-[2rem] bg-surface-container-low p-6">
            <ProductImage
              imageUrl={product.imageUrl}
              alt={product.name}
              emoji={product.imageEmoji}
              bg={product.imageBg}
              size="lg"
              className="h-[420px] rounded-[1.5rem] lg:h-[640px]"
            />
          </div>
        </div>

        <div className="col-span-12 flex flex-col lg:col-span-5">
          <div className="mb-2 text-sm font-bold tracking-widest text-primary">
            {content.seriesLabel}
          </div>
          <h1 className="mb-6 text-4xl font-black leading-tight text-on-surface">
            {product.name}
            <br />
            <span className="text-2xl font-medium text-on-surface-variant">
              {product.description}
            </span>
          </h1>

          <div className="mb-8 rounded-2xl border-l-4 border-primary bg-surface-container-low p-6">
            <div className="mb-4 flex items-end justify-between">
              <div className="flex flex-col">
                <span className="mb-1 text-sm text-on-surface-variant">
                  일반 판매가
                </span>
                {normalDiscount > 0 ? (
                  <>
                    <span className="text-lg text-on-surface-variant line-through">
                      {formatCurrency(originalPrice)}
                    </span>
                    <span className="text-sm font-bold text-on-surface">
                      일반 회원가 {formatCurrency(normalPrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-on-surface">
                    {formatCurrency(normalPrice)}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded bg-secondary-container px-2 py-0.5 text-xs font-bold text-on-secondary-container">
                    사업자 {businessDiscount}% 할인
                  </span>
                </div>
                <span className="text-4xl font-black text-primary">
                  {formatCurrency(businessPrice)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-on-surface-variant">
              <Icon name="info" className="text-sm" />
              {content.businessPriceHint}
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-surface-container p-4">
              <div className="mb-1 text-xs text-on-surface-variant">
                {content.shippingCardLabel}
              </div>
              <div className="text-sm font-bold">
                {content.shippingLeadLabel} <br />
                <span className="text-primary">
                  {content.shippingLeadHighlight}
                </span>
              </div>
            </div>
            <div className="rounded-xl bg-surface-container p-4">
              <div className="mb-1 text-xs text-on-surface-variant">
                {content.originCardLabel}
              </div>
              <div className="text-sm font-bold">
                {product.origin}
                <br />
                표준 규격 {product.unit}
              </div>
            </div>
          </div>

          <ProductDetailActions productId={product.id} />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-12 gap-12 border-t-2 border-surface-container pt-12">
        <div className="col-span-12 lg:col-span-8">
          <div className="space-y-12">
            <section>
              <h2 className="mb-8 flex items-center gap-3 text-2xl font-black">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm text-white">
                  01
                </span>
                {content.sections.origin}
              </h2>
              <div className="rounded-[2rem] bg-surface-container-low p-10">
                <div className="mb-3 text-sm text-on-surface-variant">
                  생산지
                </div>
                <div className="text-3xl font-bold text-on-surface">
                  {product.origin}
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-on-surface-variant">
                  {product.name}은 {product.origin} 기준 산지 네트워크에서 선별되어
                  입고됩니다. 상품 상태와 규격은 입고 시점 기준으로 검수되며,
                  식당과 일반 가정 모두 쓰기 쉬운 표준 포장 단위로 출고됩니다.
                </p>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-8">
              <div>
                <h2 className="mb-8 flex items-center gap-3 text-2xl font-black">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm text-white">
                    02
                  </span>
                  {content.sections.metrics}
                </h2>
                <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                  <div className="space-y-6">
                    {content.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="flex items-center justify-between"
                      >
                        <span className="font-medium text-on-surface-variant">
                          {metric.label}
                        </span>
                        <div className="mx-4 h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${metric.percent}%` }}
                          />
                        </div>
                        <span className="font-bold">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-8 flex items-center gap-3 text-2xl font-black">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm text-white">
                    03
                  </span>
                  {content.sections.nutrition}
                </h2>
                <div className="grid grid-cols-2 gap-6 rounded-[2rem] bg-surface-container-low p-8">
                  {content.nutrition.map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="text-xl font-bold text-primary">
                        {item.value}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="mt-20">
            <div className="mb-8 flex border-b border-surface-container-highest">
              {content.tabs.map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={
                    index === 0
                      ? "border-b-2 border-primary px-8 py-4 font-bold text-primary"
                      : "px-8 py-4 text-on-surface-variant hover:text-on-surface"
                  }
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="space-y-8 rounded-3xl bg-white p-10 text-on-surface-variant">
              {content.policySections.map((section) => (
                <div key={section.title}>
                  <h4 className="mb-4 font-bold text-on-surface">
                    {section.title}
                  </h4>
                  <ul className="list-disc space-y-2 pl-5 text-sm">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-4">
          <div className="sticky top-28 space-y-8">
            <div className="rounded-3xl bg-primary/5 p-8">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                {content.recommendationTitle}
                <Icon name="auto_awesome" className="text-sm text-primary" />
              </h3>
              <div className="space-y-6">
                {recommendations.map((recommendation) => (
                  <Link
                    key={recommendation.id}
                    href={`/products/${recommendation.id}`}
                    className="group flex gap-4"
                  >
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-surface-container">
                      <ProductImage
                        imageUrl={recommendation.imageUrl}
                        alt={recommendation.name}
                        emoji={recommendation.imageEmoji}
                        bg={recommendation.imageBg}
                        size="md"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-sm font-bold transition-colors group-hover:text-primary">
                        {recommendation.name}
                      </div>
                      <div className="font-bold text-primary">
                        {formatCurrency(getUnitPrice(recommendation, "BUSINESS"))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed bottom-8 left-1/2 z-40 flex w-[90%] max-w-4xl -translate-x-1/2 items-center justify-between rounded-[2rem] border border-white/20 bg-white/80 px-8 py-4 shadow-[0_-8px_32px_rgba(0,76,22,0.1)] backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="border-r border-surface-container-highest pr-6 text-xs font-black uppercase tracking-tighter text-primary">
            {content.quickReorderLabel}
          </div>
          <div className="flex gap-2">
            {quickReorderProducts.map((recentProduct) => (
              <div
                key={recentProduct.id}
                className="h-10 w-10 overflow-hidden rounded-full bg-surface-container ring-2 ring-white"
              >
                <ProductImage
                  imageUrl={recentProduct.imageUrl}
                  alt={recentProduct.name}
                  emoji={recentProduct.imageEmoji}
                  bg={recentProduct.imageBg}
                  size="sm"
                />
              </div>
            ))}
          </div>
          <div className="text-sm font-bold text-on-surface-variant">
            {content.quickReorderDescription}
          </div>
        </div>
        <Link
          href="/reorder"
          className="rounded-full bg-secondary-container px-8 py-3 text-sm font-bold text-on-secondary-container shadow-lg shadow-secondary-container/20 transition-transform hover:scale-105"
        >
          {content.quickReorderActionLabel}
        </Link>
      </div>
    </main>
  );
}
