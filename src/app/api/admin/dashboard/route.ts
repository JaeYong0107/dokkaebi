import { NextResponse } from "next/server";
import { ORDER_STATUS_LABEL } from "@/features/order/types";
import { adminDashboard } from "@/shared/lib/data/admin-dashboard";
import { sampleProducts } from "@/shared/lib/data/products";
import { listLocalOrders } from "@/server/local-orders";

function getStatusTone(status: string) {
  if (status === "SHIPPING") {
    return "bg-primary-fixed text-on-primary-fixed";
  }

  if (status === "PREPARING") {
    return "bg-secondary-fixed text-on-secondary-fixed";
  }

  return "bg-surface-container-highest text-on-surface-variant";
}

export async function GET() {
  const orders = await listLocalOrders();
  const productsById = Object.fromEntries(
    sampleProducts.map((product) => [product.id, product])
  );

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const todayOrderCount = orders.length;
  const lowInventory = sampleProducts
    .filter((product) => product.isActive)
    .filter((product) => (product.stockQuantity ?? 0) <= 10)
    .slice(0, 3)
    .map((product) => ({
      productId: product.id,
      name: product.name,
      remain: `잔여: ${product.stockQuantity ?? 0}${product.unit.includes("kg") ? "kg" : "개"}`,
      imageUrl: product.imageUrl
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
    metrics: {
      totalSales,
      todayOrderCount
    },
    recentOrders,
    inventory: lowInventory,
    inquiryCount: adminDashboard.inquiries.length,
    lowInventoryCount: lowInventory.length,
    signupAvatarOverflow: 15
  });
}
