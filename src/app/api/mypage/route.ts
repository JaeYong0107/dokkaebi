import { NextResponse } from "next/server";
import { account } from "@/shared/lib/data/account";
import { sampleProducts } from "@/shared/lib/data/products";
import { listLocalOrders } from "@/server/local-orders";

export async function GET() {
  const orders = await listLocalOrders();
  const productsById = Object.fromEntries(
    sampleProducts.map((product) => [product.id, product])
  );

  const recentOrders = orders.slice(0, 2).map((order, index) => ({
    id: order.id,
    date: order.orderedAt.split(" ")[0].replace(/-/g, "."),
    orderNumber: order.orderNumber,
    title:
      order.items.length > 1
        ? `${order.items[0].productName} 외 ${order.items.length - 1}건`
        : order.items[0]?.productName ?? "주문 상품",
    status:
      order.orderStatus === "DELIVERED"
        ? `배송완료 · ${order.total.toLocaleString("ko-KR")}원`
        : `${order.orderStatus} · ${order.total.toLocaleString("ko-KR")}원`,
    imageUrl: productsById[order.items[0]?.productId]?.imageUrl,
    extras: Math.max(0, order.items.length - 1),
    primary: index === 0
  }));

  const productCountById = orders.reduce<Record<string, number>>((acc, order) => {
    order.items.forEach((item) => {
      acc[item.productId] = (acc[item.productId] ?? 0) + item.quantity;
    });
    return acc;
  }, {});

  const frequentlyBought = Object.entries(productCountById)
    .sort((a, b) => b[1] - a[1])
    .map(([productId]) => productsById[productId])
    .filter((product) => product?.isActive)
    .slice(0, 2)
    .map((product) => ({
      productId: product.id,
      eyebrow: product.badges?.[0] ?? product.category,
      name: product.name,
      price: Math.round(
        product.basePrice * ((100 - product.businessDiscountRate) / 100)
      ),
      priceOriginal: product.basePrice,
      imageUrl: product.imageUrl
    }));

  const quickReorder = orders[0]?.items.slice(0, 3).map((item) => ({
    productId: item.productId,
    name: productsById[item.productId]?.name ?? item.productName
  })) ?? [];

  const progressingOrders = orders.filter((order) =>
    ["PAID", "PREPARING", "SHIPPING"].includes(order.orderStatus)
  ).length;

  return NextResponse.json({
    ...account,
    recentOrders,
    frequentlyBought,
    quickReorder,
    stats: {
      coupons: account.kpis.coupons,
      points: account.kpis.points,
      progressingOrders,
      inquiries: 0
    }
  });
}
