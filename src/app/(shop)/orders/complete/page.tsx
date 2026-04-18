import Link from "next/link";
import { notFound } from "next/navigation";
import type { OrderRecord } from "@/features/order/types";
import type { Product } from "@/features/product/types";
import { ProductImage } from "@/entities/product/ui/ProductImage";
import { getServerOrigin } from "@/shared/lib/api/server-origin";
import { formatCurrency } from "@/shared/lib/format";
import { Icon } from "@/shared/ui/Icon";

type OrderCompletePageProps = {
  searchParams: Promise<{
    orderId?: string;
  }>;
};

export default async function OrderCompletePage({
  searchParams
}: OrderCompletePageProps) {
  const { orderId } = await searchParams;

  if (!orderId) {
    notFound();
  }

  const origin = await getServerOrigin();
  const [orderResponse, productsResponse] = await Promise.all([
    fetch(`${origin}/api/orders/${orderId}`, { cache: "no-store" }),
    fetch(`${origin}/api/products`, { cache: "no-store" })
  ]);

  if (!orderResponse.ok) {
    notFound();
  }

  const order = (await orderResponse.json()) as OrderRecord;
  const productsData = (await productsResponse.json()) as { items: Product[] };
  const sampleProducts = productsData.items;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-grow flex-col items-center justify-start px-4 pb-24 pt-12">
      <div className="mb-12 text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-xl">
          <Icon name="check_circle" filled className="text-4xl text-white" />
        </div>
        <h1 className="mb-3 font-headline text-4xl font-extrabold tracking-tight text-primary">
          주문이 완료되었습니다
        </h1>
        <p className="text-lg text-on-surface-variant">
          도깨비와 함께 신선한 하루를 준비해 주셔서 감사합니다.
        </p>
      </div>

      <div className="mb-8 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-8 shadow-sm">
          <div>
            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-on-surface-variant">
              배송 안내
            </h2>
            <div className="mb-4 flex items-start gap-4">
              <Icon
                name="local_shipping"
                className="rounded-lg bg-surface-container-low p-2 text-primary"
              />
              <div>
                <p className="text-sm text-on-surface-variant">배송 예정일</p>
                <p className="text-xl font-bold text-on-surface">
                  내일 오전 7시 전 도착 예정
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-surface-container-low pt-6">
            <p className="mb-2 text-xs text-on-surface-variant">주문 번호</p>
            <p className="font-mono text-base font-bold tracking-wider">
              {order.orderNumber}
            </p>
            <p className="mt-2 text-xs text-on-surface-variant">
              주문 시각 {order.orderedAt}
            </p>
          </div>
        </div>

        <div className="relative flex flex-col justify-center overflow-hidden rounded-xl bg-primary-container p-8">
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3">
              <Icon name="chat_bubble" className="text-3xl text-on-primary-container" />
              <h2 className="font-headline text-xl font-bold text-on-primary-container">
                주문 안내
              </h2>
            </div>
            <p className="leading-relaxed text-on-primary-container">
              방금 결제한 품목과 금액 기준으로 주문 요약이 저장되었습니다.
              <br />
              배송이 시작되면 주문 내역 페이지에서 상태를 확인할 수 있습니다.
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-10">
            <Icon name="inventory_2" className="text-9xl" />
          </div>
        </div>
      </div>

      <div className="mb-12 w-full rounded-xl bg-surface-container-low p-8">
        <h3 className="mb-6 font-headline text-xl font-bold text-on-surface">
          주문 상품 요약
        </h3>
        <div className="space-y-4">
          {order.items.map((item) => {
            const product = sampleProducts.find(
              (candidate) => candidate.id === item.productId
            );

            return (
              <div
                key={item.productId}
                className="flex items-center gap-6 rounded-xl bg-surface-container-lowest p-4"
              >
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-surface-variant">
                  <ProductImage
                    imageUrl={product?.imageUrl}
                    alt={item.productName}
                    emoji={item.imageEmoji}
                    bg={item.imageBg}
                    size="md"
                  />
                </div>
                <div className="flex-grow">
                  <p className="mb-1 text-xs font-medium text-on-surface-variant">
                    {product?.category ?? "상품"}
                  </p>
                  <h4 className="font-bold text-on-surface">{item.productName}</h4>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {item.quantity}개 / {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-on-surface-variant">
                    {order.customerType === "BUSINESS" ? "사업자 적용가" : "회원 적용가"}
                  </p>
                  <p className="font-headline text-lg font-black text-primary">
                    {formatCurrency(item.lineTotal)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 space-y-3 border-t border-outline-variant/30 pt-6">
          <div className="flex justify-between text-sm text-on-surface-variant">
            <span>상품 금액</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-on-surface-variant">
            <span>배송비</span>
            <span>
              {order.shippingFee === 0 ? "무료" : formatCurrency(order.shippingFee)}
            </span>
          </div>
          <div className="flex items-end justify-between border-t border-outline-variant/30 pt-4">
            <span className="text-on-surface-variant">최종 결제 금액</span>
            <div className="text-right">
              <span className="mr-2 text-sm text-on-surface-variant">
                총 {order.items.length}개 품목
              </span>
              <span className="text-3xl font-black text-primary">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
        <Link
          href="/orders"
          className="flex items-center justify-center gap-2 rounded-md bg-surface-container-highest px-12 py-4 font-bold text-on-surface transition-all hover:bg-surface-variant active:scale-95"
        >
          주문 내역 보기
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-md bg-gradient-to-br from-primary to-primary-container px-12 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
        >
          쇼핑 계속하기
          <Icon name="arrow_forward" className="text-lg" />
        </Link>
      </div>
    </main>
  );
}
