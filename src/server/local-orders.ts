import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { OrderRecord } from "@/features/order/types";
import type { CustomerType } from "@/features/pricing/types";
import seedOrders from "../../data/orders.json";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

type CreateOrderInput = {
  customerType: CustomerType;
  customerName: string;
  recipient: string;
  shippingAddress: string;
  items: OrderRecord["items"];
  subtotal: number;
  shippingFee: number;
  total: number;
};

async function ensureOrdersFile() {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    await readFile(ORDERS_FILE, "utf8");
  } catch {
    await writeFile(
      ORDERS_FILE,
      JSON.stringify(seedOrders as OrderRecord[], null, 2),
      "utf8"
    );
  }
}

export async function listLocalOrders() {
  await ensureOrdersFile();
  const content = await readFile(ORDERS_FILE, "utf8");
  return JSON.parse(content) as OrderRecord[];
}

export async function getLocalOrderById(id: string) {
  const orders = await listLocalOrders();
  return orders.find((order) => order.id === id) ?? null;
}

export async function createLocalOrder(input: CreateOrderInput) {
  const orders = await listLocalOrders();
  const now = new Date();
  const orderedAt = now.toLocaleString("sv-SE", {
    timeZone: "Asia/Seoul",
    hour12: false
  });
  const stamp = orderedAt.replace(/\D/g, "").slice(0, 12);

  const nextOrder: OrderRecord = {
    id: `order-${stamp}-${String(orders.length + 1).padStart(3, "0")}`,
    orderNumber: `DK-${stamp}-${String(orders.length + 1).padStart(4, "0")}`,
    orderedAt,
    customerType: input.customerType,
    customerName: input.customerName,
    items: input.items,
    subtotal: input.subtotal,
    shippingFee: input.shippingFee,
    total: input.total,
    orderStatus: "PAID",
    paymentStatus: "PAID",
    shippingAddress: input.shippingAddress,
    recipient: input.recipient
  };

  const nextOrders = [nextOrder, ...orders];
  await writeFile(ORDERS_FILE, JSON.stringify(nextOrders, null, 2), "utf8");

  return nextOrder;
}
