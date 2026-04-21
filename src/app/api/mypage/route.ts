import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { accountContent as account } from "@/server/content/account-content";
import { ORDER_INCLUDE, toOrderRecord } from "@/server/mappers/order";
import { toProduct } from "@/server/mappers/product";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { message: "로그인이 필요합니다" },
      { status: 401 }
    );
  }

  const [orderRows, productRows] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: ORDER_INCLUDE,
      orderBy: { orderedAt: "desc" }
    }),
    prisma.product.findMany({ include: { category: true } })
  ]);

  const orders = orderRows.map(toOrderRecord);
  const products = productRows.map(toProduct);
  const productsById = Object.fromEntries(products.map((p) => [p.id, p]));

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
    imageUrl: productsById[order.items[0]?.productId ?? ""]?.imageUrl,
    extras: Math.max(0, order.items.length - 1),
    primary: index === 0
  }));

  const productCountById = orders.reduce<Record<string, number>>(
    (acc, order) => {
      order.items.forEach((item) => {
        acc[item.productId] = (acc[item.productId] ?? 0) + item.quantity;
      });
      return acc;
    },
    {}
  );

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

  const quickReorder =
    orders[0]?.items.slice(0, 3).map((item) => ({
      productId: item.productId,
      name: productsById[item.productId]?.name ?? item.productName
    })) ?? [];

  const progressingOrders = orders.filter((order) =>
    ["PAID", "PREPARING", "SHIPPING"].includes(order.orderStatus)
  ).length;

  const user = session.user;
  const nickname = user.businessName ?? user.name ?? account.profile.nickname;
  const gradeLabel =
    user.customerType === "BUSINESS"
      ? user.businessApproved
        ? "사업자 회원 (승인 완료)"
        : "사업자 승인 대기"
      : account.profile.gradeLabel;

  return NextResponse.json({
    ...account,
    profile: {
      ...account.profile,
      nickname,
      gradeLabel
    },
    viewer: {
      customerType: user.customerType,
      businessApproved: user.businessApproved
    },
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
