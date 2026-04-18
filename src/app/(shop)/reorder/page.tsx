import Link from "next/link";
import { sampleOrders } from "@/features/order/mock-data";
import { sampleProducts } from "@/features/product/mock-data";
import { buildReorderItems } from "@/features/reorder/reorder-service";
import { formatCurrency } from "@/lib/format";
import { Icon } from "@/components/common/Icon";
import { ProductImage } from "@/components/shell/ProductImage";

type ReorderPageProps = {
  searchParams?: Promise<{
    orderId?: string;
  }>;
};

export default async function ReorderPage({ searchParams }: ReorderPageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedOrder =
    sampleOrders.find((order) => order.id === resolvedSearchParams?.orderId) ??
    sampleOrders[0];
  const sourceItems = selectedOrder.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity
  }));
  const reorderItems = buildReorderItems({
    recentOrderItems: sourceItems,
    products: sampleProducts
  });

  const discontinuedItems = sourceItems.filter((item) => {
    const product = sampleProducts.find((p) => p.id === item.productId);
    return !product || !product.isActive;
  });

  const subtotal = reorderItems.reduce((sum, item) => {
    const product = sampleProducts.find((p) => p.id === item.productId);
    return product ? sum + product.priceBusiness * item.quantity : sum;
  }, 0);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 md:py-10">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          fast reorder
        </p>
        <h1 className="mt-2 font-headline text-3xl font-black md:text-4xl">
          한 번의 탭으로 다시 담기
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          최근 주문에서 자주 구매한 식자재를 모아두었습니다. 사업자 가격이 자동 적용됩니다.
        </p>
        <p className="mt-2 text-xs font-semibold text-primary">
          현재 선택한 주문: {selectedOrder.orderNumber}
        </p>
      </header>

      {/* Recent Orders carousel */}
      <section className="mb-10">
        <h2 className="mb-4 font-headline text-lg font-bold">최근 주문</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sampleOrders.slice(0, 3).map((order) => (
            <article
              key={order.id}
              className="rounded-3xl bg-surface-container-lowest p-5 shadow-lift"
            >
              <p className="text-xs text-on-surface-variant">
                {order.orderedAt.split(" ")[0]}
              </p>
              <p className="mt-1 font-bold text-on-surface">
                {order.items[0].productName}
                {order.items.length > 1 && (
                  <span className="ml-1 text-sm font-normal text-on-surface-variant">
                    외 {order.items.length - 1}건
                  </span>
                )}
              </p>
              <p className="mt-2 font-headline text-xl font-black text-primary">
                {formatCurrency(order.total)}
              </p>
              <Link
                href={`/reorder?orderId=${order.id}#current`}
                className="mt-3 flex items-center justify-center gap-1 rounded-full bg-secondary-container/15 py-2 text-xs font-bold text-secondary-container hover:bg-secondary-container/25"
              >
                <Icon name="autorenew" className="text-base" />
                다시 담기
              </Link>
            </article>
          ))}
        </div>
      </section>

      <div id="current" className="grid gap-8 md:grid-cols-[1fr_360px]">
        {/* Items */}
        <section className="space-y-4">
          <h2 className="font-headline text-lg font-bold">담을 상품</h2>
          {reorderItems.map((item) => {
            const product = sampleProducts.find((p) => p.id === item.productId);
            if (!product) return null;
            return (
              <article
                key={item.productId}
                className="flex gap-4 rounded-3xl bg-surface-container-lowest p-4 shadow-lift"
              >
                <div className="h-20 w-20 flex-none overflow-hidden rounded-2xl bg-surface-container-low">
                  <ProductImage
                    emoji={product.imageEmoji}
                    bg={product.imageBg}
                    size="lg"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="font-bold">{product.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {product.unit}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center overflow-hidden rounded-full border border-outline-variant bg-white">
                      <button className="px-3 py-1 text-on-surface-variant">
                        <Icon name="remove" className="text-base" />
                      </button>
                      <span className="px-3 text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button className="px-3 py-1 text-on-surface-variant">
                        <Icon name="add" className="text-base" />
                      </button>
                    </div>
                    <span className="font-headline font-bold text-primary">
                      {formatCurrency(product.priceBusiness * item.quantity)}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}

          {discontinuedItems.length > 0 && (
            <div className="rounded-3xl border-2 border-dashed border-outline-variant bg-surface-container-low p-5">
              <h3 className="mb-3 flex items-center gap-2 font-bold text-on-surface-variant">
                <Icon name="info" />
                재주문에서 제외된 상품
              </h3>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                {discontinuedItems.map((item) => {
                  const product = sampleProducts.find(
                    (p) => p.id === item.productId
                  );
                  return (
                    <li key={item.productId} className="flex items-center gap-2">
                      <span className="text-lg">{product?.imageEmoji}</span>
                      <span className="line-through">
                        {product?.name ?? item.productId}
                      </span>
                      <span className="rounded-full bg-error-container/40 px-2 py-0.5 text-xs font-bold text-on-error-container">
                        판매 종료
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>

        {/* Summary */}
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="space-y-4 rounded-3xl bg-surface-container-low p-6">
            <h2 className="font-headline text-lg font-bold">주문 요약</h2>
            <p className="text-xs text-on-surface-variant">
              {reorderItems.length}개 상품 · 사업자 가격 자동 적용
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">상품 금액</span>
                <span className="font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">배송비</span>
                <span className="font-bold text-primary">무료</span>
              </div>
            </div>
            <div className="border-t border-surface-container-highest pt-3">
              <div className="flex items-baseline justify-between">
                <span className="text-base font-bold">결제 예상 금액</span>
                <span className="font-headline text-2xl font-black text-primary">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full rounded-xl bg-secondary-container py-4 text-center font-bold text-on-secondary"
            >
              한 번에 주문하기
            </Link>
            <Link
              href="/cart"
              className="block w-full rounded-xl border border-outline-variant bg-white py-3 text-center text-sm font-bold text-on-surface hover:border-primary"
            >
              장바구니로 보내기
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
