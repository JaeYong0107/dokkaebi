import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/common/Icon";
import { ProductDetailActions } from "@/components/cart/ProductDetailActions";
import { ProductImage } from "@/components/shell/ProductImage";
import {
  getActiveProducts,
  getProductById,
  sampleProducts
} from "@/features/product/mock-data";
import { formatCurrency } from "@/lib/format";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function buildMetrics(productName: string) {
  if (productName.includes("레터스")) {
    return [
      { label: "수분 함량", value: "95%", percent: 95 },
      { label: "조직감", value: "우수", percent: 88 },
      { label: "당도(Brix)", value: "4.2", percent: 45 }
    ];
  }

  return [
    { label: "신선도", value: "상", percent: 90 },
    { label: "재구매율", value: "87%", percent: 87 },
    { label: "규격 안정성", value: "우수", percent: 82 }
  ];
}

function buildNutrition(productName: string) {
  if (productName.includes("레터스")) {
    return [
      { label: "열량", value: "15 kcal" },
      { label: "식이섬유", value: "1.5g" },
      { label: "비타민C", value: "25mg" },
      { label: "칼슘", value: "32mg" }
    ];
  }

  return [
    { label: "열량", value: "42 kcal" },
    { label: "탄수화물", value: "9.8g" },
    { label: "비타민A", value: "18%" },
    { label: "칼륨", value: "320mg" }
  ];
}

export default async function ProductDetailPage({
  params
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product || !product.isActive) {
    notFound();
  }

  const recommendations = getActiveProducts()
    .filter((candidate) => candidate.id !== product.id)
    .slice(0, 3);
  const businessDiscount = Math.round(
    ((product.priceNormal - product.priceBusiness) / product.priceNormal) * 100
  );
  const metrics = buildMetrics(product.name);
  const nutrition = buildNutrition(product.name);
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
                  emoji={product.imageEmoji}
                  bg={product.imageBg}
                  size="md"
                />
              </div>
            ))}
          </div>
          <div className="flex-1 overflow-hidden rounded-[2rem] bg-surface-container-low p-6">
            <ProductImage
              emoji={product.imageEmoji}
              bg={product.imageBg}
              size="lg"
              className="h-full min-h-[420px] rounded-[1.5rem]"
            />
          </div>
        </div>

        <div className="col-span-12 flex flex-col lg:col-span-5">
          <div className="mb-2 text-sm font-bold tracking-widest text-primary">
            [dokkaebi] 산지직송 시리즈
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
                <span className="text-lg text-on-surface-variant line-through">
                  {formatCurrency(product.priceNormal)}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded bg-secondary-container px-2 py-0.5 text-xs font-bold text-on-secondary-container">
                    사업자 {businessDiscount}% 할인
                  </span>
                </div>
                <span className="text-4xl font-black text-primary">
                  {formatCurrency(product.priceBusiness)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-on-surface-variant">
              <Icon name="info" className="text-sm" />
              로그인 후 사업자 가격과 혜택이 자동 반영됩니다
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-surface-container p-4">
              <div className="mb-1 text-xs text-on-surface-variant">배송정보</div>
              <div className="text-sm font-bold">
                오전 10시 전 주문 시 <br />
                <span className="text-primary">오늘 출발</span>
              </div>
            </div>
            <div className="rounded-xl bg-surface-container p-4">
              <div className="mb-1 text-xs text-on-surface-variant">원산지</div>
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
                산지 직송 정보
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
                  상품 지표
                </h2>
                <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                  <div className="space-y-6">
                    {metrics.map((metric) => (
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
                  영양 정보 (100g 당)
                </h2>
                <div className="grid grid-cols-2 gap-6 rounded-[2rem] bg-surface-container-low p-8">
                  {nutrition.map((item) => (
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
              <button
                type="button"
                className="border-b-2 border-primary px-8 py-4 font-bold text-primary"
              >
                배송/교환/환불 정보
              </button>
              <button
                type="button"
                className="px-8 py-4 text-on-surface-variant hover:text-on-surface"
              >
                상품 문의
              </button>
              <button
                type="button"
                className="px-8 py-4 text-on-surface-variant hover:text-on-surface"
              >
                구매 리뷰
              </button>
            </div>
            <div className="space-y-8 rounded-3xl bg-white p-10 text-on-surface-variant">
              <div>
                <h4 className="mb-4 font-bold text-on-surface">배송 안내</h4>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>평일 오전 10시 이전 결제 완료 시 당일 발송이 가능합니다.</li>
                  <li>신선식품 특성상 도서산간 지역은 배송이 제한될 수 있습니다.</li>
                  <li>배송 상태는 주문 상세와 배송 조회 화면에서 확인할 수 있습니다.</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-bold text-on-surface">
                  교환 및 반품 안내
                </h4>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>신선식품은 단순 변심에 의한 교환 및 반품이 제한됩니다.</li>
                  <li>상품 파손 또는 품질 이슈는 수령 직후 고객센터로 접수해 주세요.</li>
                  <li>문제 확인 시 재발송 또는 환불 정책이 적용됩니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-4">
          <div className="sticky top-28 space-y-8">
            <div className="rounded-3xl bg-primary/5 p-8">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                함께 사면 좋은 상품
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
                        {formatCurrency(recommendation.priceBusiness)}
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
            Quick Reorder
          </div>
          <div className="flex gap-2">
            {quickReorderProducts.map((recentProduct) => (
              <div
                key={recentProduct.id}
                className="h-10 w-10 overflow-hidden rounded-full bg-surface-container ring-2 ring-white"
              >
                <ProductImage
                  emoji={recentProduct.imageEmoji}
                  bg={recentProduct.imageBg}
                  size="sm"
                />
              </div>
            ))}
          </div>
          <div className="text-sm font-bold text-on-surface-variant">
            최근 구매한 상품을 빠르게 담으세요
          </div>
        </div>
        <Link
          href="/reorder"
          className="rounded-full bg-secondary-container px-8 py-3 text-sm font-bold text-on-secondary-container shadow-lg shadow-secondary-container/20 transition-transform hover:scale-105"
        >
          장바구니 전체 담기
        </Link>
      </div>
    </main>
  );
}
