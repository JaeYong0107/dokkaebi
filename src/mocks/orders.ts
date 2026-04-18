import type { OrderRecord } from "@/features/order/types";

export const sampleOrders: OrderRecord[] = [
  {
    id: "order-2024-0418-001",
    orderNumber: "DK-20260418-0001",
    orderedAt: "2026-04-17 09:32",
    customerType: "BUSINESS",
    customerName: "두두 한식당",
    items: [
      {
        productId: "prod-carrot-001",
        productName: "국산 흙당근 10kg",
        quantity: 2,
        unitPrice: 18900,
        lineTotal: 37800,
        imageEmoji: "🥕",
        imageBg: "from-orange-200 to-orange-400"
      },
      {
        productId: "prod-onion-001",
        productName: "국산 양파 3kg",
        quantity: 3,
        unitPrice: 7600,
        lineTotal: 22800,
        imageEmoji: "🧅",
        imageBg: "from-amber-100 to-amber-300"
      }
    ],
    subtotal: 60600,
    shippingFee: 0,
    total: 60600,
    orderStatus: "SHIPPING",
    paymentStatus: "PAID",
    shippingAddress: "서울특별시 마포구 양화로 45 두두빌딩 2F",
    recipient: "이사장",
    trackingNumber: "657198432011",
    courierName: "롯데택배"
  },
  {
    id: "order-2024-0410-002",
    orderNumber: "DK-20260410-0188",
    orderedAt: "2026-04-09 14:18",
    customerType: "BUSINESS",
    customerName: "두두 한식당",
    items: [
      {
        productId: "prod-egg-001",
        productName: "무항생제 왕란 60구",
        quantity: 4,
        unitPrice: 18500,
        lineTotal: 74000,
        imageEmoji: "🥚",
        imageBg: "from-stone-100 to-stone-300"
      },
      {
        productId: "prod-broccoli-001",
        productName: "유기농 브로콜리 5kg",
        quantity: 1,
        unitPrice: 23800,
        lineTotal: 23800,
        imageEmoji: "🥦",
        imageBg: "from-green-200 to-green-400"
      }
    ],
    subtotal: 97800,
    shippingFee: 0,
    total: 97800,
    orderStatus: "DELIVERED",
    paymentStatus: "PAID",
    shippingAddress: "서울특별시 마포구 양화로 45 두두빌딩 2F",
    recipient: "이사장",
    trackingNumber: "657198431287",
    courierName: "롯데택배"
  },
  {
    id: "order-2024-0331-003",
    orderNumber: "DK-20260331-0072",
    orderedAt: "2026-03-31 08:02",
    customerType: "NORMAL",
    customerName: "이재용",
    items: [
      {
        productId: "prod-lemon-001",
        productName: "레몬 20과",
        quantity: 1,
        unitPrice: 14500,
        lineTotal: 14500,
        imageEmoji: "🍋",
        imageBg: "from-yellow-200 to-yellow-400"
      }
    ],
    subtotal: 14500,
    shippingFee: 3000,
    total: 17500,
    orderStatus: "DELIVERED",
    paymentStatus: "PAID",
    shippingAddress: "서울특별시 송파구 올림픽로 300",
    recipient: "이재용"
  }
];

export function getOrderById(id: string) {
  return sampleOrders.find((order) => order.id === id) ?? null;
}
