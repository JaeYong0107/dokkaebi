import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABEL } from "@/features/order/types";
import { adminDashboardContent as adminDashboard } from "@/server/content/admin-dashboard-content";
import { ORDER_INCLUDE, toOrderRecord } from "@/server/mappers/order";
import { toProduct } from "@/server/mappers/product";

function getStatusTone(status: string) {
  if (status === "SHIPPING") return "bg-primary-fixed text-on-primary-fixed";
  if (status === "PREPARING") return "bg-secondary-fixed text-on-secondary-fixed";
  return "bg-surface-container-highest text-on-surface-variant";
}

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "관리자 권한이 필요합니다" },
      { status: 403 }
    );
  }

  const [orderRows, productRows] = await Promise.all([
    prisma.order.findMany({
      include: ORDER_INCLUDE,
      orderBy: { orderedAt: "desc" }
    }),
    prisma.product.findMany({ include: { category: true } })
  ]);

  const orders = orderRows.map(toOrderRecord);
  const products = productRows.map(toProduct);

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const todayOrderCount = orders.length;

  const lowInventory = products
    .filter((p) => p.isActive)
    .filter((p) => (p.stockQuantity ?? 0) <= 10)
    .slice(0, 3)
    .map((p) => ({
      productId: p.id,
      name: p.name,
      remain: `잔여: ${p.stockQuantity ?? 0}${p.unit.includes("kg") ? "kg" : "개"}`,
      stockQuantity: p.stockQuantity ?? 0,
      imageUrl: p.imageUrl
    }));

  const recentOrders = orders.slice(0, 4).map((order) => ({
    id: order.orderNumber,
    name: order.customerName,
    product:
      order.items.length > 1
        ? `${order.items[0].productName} 외 ${order.items.length - 1}건`
        : order.items[0]?.productName ?? "주문 상품",
    price: `₩${order.total.toLocaleString("ko-KR")}`,
    status: ORDER_STATUS_LABEL[order.orderStatus],
    statusTone: getStatusTone(order.orderStatus)
  }));

  return NextResponse.json({
    ...adminDashboard,
    metrics: { totalSales, todayOrderCount },
    recentOrders,
    inventory: lowInventory,
    inquiryCount: adminDashboard.inquiries.length,
    lowInventoryCount: lowInventory.length,
    signupAvatarOverflow: 15
  });
}
