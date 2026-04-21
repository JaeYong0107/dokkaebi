import { Suspense } from "react";
import type { OrderRecord } from "@/features/order/types";
import { serverFetch } from "@/shared/lib/api/server-fetch";
import { ReorderView } from "./ReorderView";

export default async function ReorderPage() {
  const response = await serverFetch("/api/orders");
  const data = (await response.json()) as { items: OrderRecord[] };
  const orders = data.items;

  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-6xl px-6 py-8 md:py-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            fast reorder
          </p>
          <h1 className="mt-2 font-headline text-3xl font-black md:text-4xl">
            한 번의 탭으로 다시 담기
          </h1>
          <div className="mt-8 rounded-3xl bg-surface-container-low p-12 text-center text-on-surface-variant">
            재주문 정보를 불러오는 중...
          </div>
        </main>
      }
    >
      <ReorderView orders={orders} />
    </Suspense>
  );
}
