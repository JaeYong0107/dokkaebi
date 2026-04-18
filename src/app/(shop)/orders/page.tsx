import Link from "next/link";
import { ProductImage } from "@/entities/product/ui/ProductImage";
import { ORDER_STATUS_LABEL } from "@/features/order/types";
import type { OrderStatus } from "@/features/order/types";
import { sampleOrders } from "@/mocks/orders";
import { formatCurrency } from "@/shared/lib/format";
import { Icon } from "@/shared/ui/Icon";

const STATUS_TONE: Record<OrderStatus, string> = {
  PENDING: "bg-surface-container-high text-on-surface-variant",
  PAID: "bg-primary/10 text-primary",
  PREPARING: "bg-secondary-container/15 text-secondary-container",
  SHIPPING: "bg-secondary-container/20 text-secondary-container",
  DELIVERED: "bg-primary/10 text-primary",
  CANCELLED: "bg-error-container/40 text-on-error-container"
};

export default function OrderHistoryPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8 md:py-10">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          orders
        </p>
        <h1 className="mt-2 font-headline text-3xl font-black">주문 내역</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          최근 6개월 동안의 주문을 확인하고, 한 번의 탭으로 다시 주문할 수 있어요
        </p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {["전체", "결제 완료", "준비중", "배송중", "배송 완료", "취소"].map(
          (chip, idx) => (
            <button
              key={chip}
              className={
                idx === 0
                  ? "rounded-full bg-primary px-4 py-2 text-sm font-bold text-white"
                  : "rounded-full bg-surface-container-low px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
              }
            >
              {chip}
            </button>
          )
        )}
      </div>

      <div className="space-y-5">
        {sampleOrders.map((order) => (
          <article
            key={order.id}
            className="rounded-3xl bg-surface-container-lowest p-6 shadow-lift"
          >
            <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_TONE[order.orderStatus]}`}
                >
                  {ORDER_STATUS_LABEL[order.orderStatus]}
                </span>
                <span className="text-sm text-on-surface-variant">
                  {order.orderedAt}
                </span>
              </div>
              <Link
                href={`/orders/${order.id}/tracking`}
                className="flex items-center gap-1 text-sm font-bold text-primary hover:underline"
              >
                배송 조회
                <Icon name="chevron_right" className="text-sm" />
              </Link>
            </header>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4"
                >
                  <div className="h-16 w-16 flex-none overflow-hidden rounded-xl bg-surface-container-low">
                    <ProductImage
                      emoji={item.imageEmoji}
                      bg={item.imageBg}
                      size="md"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{item.productName}</p>
                    <p className="text-xs text-on-surface-variant">
                      수량 {item.quantity} · {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <span className="font-headline font-bold text-on-surface">
                    {formatCurrency(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-surface-container pt-4">
              <div>
                <p className="text-xs text-on-surface-variant">주문 번호</p>
                <p className="font-headline text-sm font-bold text-on-surface">
                  {order.orderNumber}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-on-surface-variant">
                  결제 금액
                </span>
                <span className="font-headline text-xl font-black text-primary">
                  {formatCurrency(order.total)}
                </span>
              </div>
              <div className="flex w-full gap-2 md:w-auto">
                <Link
                  href={`/orders/${order.id}/tracking`}
                  className="flex-1 rounded-xl border border-outline-variant bg-white px-4 py-2 text-center text-sm font-bold text-on-surface hover:border-primary md:flex-none"
                >
                  상세 보기
                </Link>
                <Link
                  href="/reorder"
                  className="flex-1 rounded-xl bg-secondary-container px-4 py-2 text-center text-sm font-bold text-on-secondary md:flex-none"
                >
                  재주문
                </Link>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </main>
  );
}
