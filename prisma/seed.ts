import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  seedCategoriesData,
  seedProductsData,
  type CategorySeed,
  type ProductSeed
} from "./seed-data";

const prisma = new PrismaClient();

const DEV_USERS = [
  {
    email: "admin@dokkaebi.kr",
    password: "admin1234",
    name: "도깨비 관리자",
    role: "ADMIN" as const,
    customerType: "NORMAL" as const,
    businessApproved: false
  },
  {
    email: "user@dokkaebi.kr",
    password: "user1234",
    name: "김소비자",
    role: "CUSTOMER" as const,
    customerType: "NORMAL" as const,
    businessApproved: false
  },
  {
    email: "biz@dokkaebi.kr",
    password: "biz12345",
    name: "두두 한식당",
    role: "CUSTOMER" as const,
    customerType: "BUSINESS" as const,
    businessName: "두두 한식당",
    businessNumber: "123-45-67890",
    businessApproved: true
  }
];

async function seedCategories(categories: CategorySeed[]) {
  const real = categories.filter((c) => c.id !== "all");
  for (const [index, category] of real.entries()) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        icon: category.icon,
        sortOrder: index,
        featured: category.featured ?? false
      },
      create: {
        id: category.id,
        name: category.name,
        icon: category.icon,
        sortOrder: index,
        featured: category.featured ?? false
      }
    });
  }
  return real;
}

function buildCategoryLabelMap(categories: CategorySeed[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const category of categories) {
    for (const label of category.productCategories ?? []) {
      map.set(label, category.id);
    }
  }
  return map;
}

async function seedProducts(
  products: ProductSeed[],
  labelToCategoryId: Map<string, string>
) {
  for (const product of products) {
    const categoryId = labelToCategoryId.get(product.category);
    if (!categoryId) {
      throw new Error(
        `상품 "${product.name}"의 카테고리 "${product.category}"를 매핑할 수 없음`
      );
    }
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        sku: product.sku,
        name: product.name,
        description: product.description,
        unit: product.unit,
        basePrice: product.basePrice,
        normalDiscountRate: product.normalDiscountRate,
        businessDiscountRate: product.businessDiscountRate,
        origin: product.origin,
        imageUrl: product.imageUrl,
        imageEmoji: product.imageEmoji,
        imageBg: product.imageBg,
        badges: product.badges ?? [],
        stockQuantity: product.stockQuantity ?? 0,
        isActive: product.isActive,
        categoryId
      },
      create: {
        id: product.id,
        sku: product.sku,
        name: product.name,
        description: product.description,
        unit: product.unit,
        basePrice: product.basePrice,
        normalDiscountRate: product.normalDiscountRate,
        businessDiscountRate: product.businessDiscountRate,
        origin: product.origin,
        imageUrl: product.imageUrl,
        imageEmoji: product.imageEmoji,
        imageBg: product.imageBg,
        badges: product.badges ?? [],
        stockQuantity: product.stockQuantity ?? 0,
        isActive: product.isActive,
        categoryId
      }
    });
  }
}

async function seedDevUsers() {
  for (const devUser of DEV_USERS) {
    const passwordHash = await bcrypt.hash(devUser.password, 10);
    await prisma.user.upsert({
      where: { email: devUser.email },
      update: {
        name: devUser.name,
        role: devUser.role,
        customerType: devUser.customerType,
        businessName: devUser.businessName ?? null,
        businessNumber: devUser.businessNumber ?? null,
        businessApproved: devUser.businessApproved,
        passwordHash
      },
      create: {
        email: devUser.email,
        name: devUser.name,
        role: devUser.role,
        customerType: devUser.customerType,
        businessName: devUser.businessName ?? null,
        businessNumber: devUser.businessNumber ?? null,
        businessApproved: devUser.businessApproved,
        passwordHash
      }
    });
  }
}

async function seedSampleOrders() {
  const biz = await prisma.user.findUnique({
    where: { email: "biz@dokkaebi.kr" }
  });
  if (!biz) return;

  const picks = await prisma.product.findMany({
    where: {
      id: { in: ["prod-carrot-001", "prod-onion-001", "prod-lettuce-001"] }
    }
  });
  const byId = new Map(picks.map((p) => [p.id, p]));
  const carrot = byId.get("prod-carrot-001");
  const onion = byId.get("prod-onion-001");
  const lettuce = byId.get("prod-lettuce-001");
  if (!carrot || !onion || !lettuce) return;

  function bizPrice(p: { basePrice: number; businessDiscountRate: number }) {
    return Math.round(p.basePrice * ((100 - p.businessDiscountRate) / 100));
  }

  const shippingOrderNumber = "DK-SEED-SHIPPING-0001";
  const deliveredOrderNumber = "DK-SEED-DELIVERED-0001";

  await prisma.order.deleteMany({
    where: {
      orderNumber: { in: [shippingOrderNumber, deliveredOrderNumber] }
    }
  });

  const shippingItems = [
    { product: carrot, qty: 2 },
    { product: onion, qty: 3 }
  ];
  const shippingSubtotal = shippingItems.reduce(
    (sum, x) => sum + bizPrice(x.product) * x.qty,
    0
  );

  await prisma.order.create({
    data: {
      userId: biz.id,
      orderNumber: shippingOrderNumber,
      customerTypeSnapshot: "BUSINESS",
      subtotalAmount: shippingSubtotal,
      shippingFee: 0,
      totalAmount: shippingSubtotal,
      orderStatus: "SHIPPING",
      paymentStatus: "PAID",
      orderedAt: new Date("2026-04-17T09:32:00+09:00"),
      items: {
        create: shippingItems.map(({ product, qty }) => ({
          productId: product.id,
          productNameSnapshot: product.name,
          unitPrice: bizPrice(product),
          quantity: qty,
          lineTotal: bizPrice(product) * qty
        }))
      },
      delivery: {
        create: {
          courierName: "롯데택배",
          trackingNumber: "657198432011",
          deliveryStatus: "SHIPPING",
          shippedAt: new Date("2026-04-18T08:00:00+09:00")
        }
      }
    }
  });

  const deliveredItems = [
    { product: lettuce, qty: 1 },
    { product: onion, qty: 2 }
  ];
  const deliveredSubtotal = deliveredItems.reduce(
    (sum, x) => sum + bizPrice(x.product) * x.qty,
    0
  );

  await prisma.order.create({
    data: {
      userId: biz.id,
      orderNumber: deliveredOrderNumber,
      customerTypeSnapshot: "BUSINESS",
      subtotalAmount: deliveredSubtotal,
      shippingFee: 0,
      totalAmount: deliveredSubtotal,
      orderStatus: "DELIVERED",
      paymentStatus: "PAID",
      orderedAt: new Date("2026-04-09T14:18:00+09:00"),
      items: {
        create: deliveredItems.map(({ product, qty }) => ({
          productId: product.id,
          productNameSnapshot: product.name,
          unitPrice: bizPrice(product),
          quantity: qty,
          lineTotal: bizPrice(product) * qty
        }))
      },
      delivery: {
        create: {
          courierName: "롯데택배",
          trackingNumber: "657198431287",
          deliveryStatus: "DELIVERED",
          shippedAt: new Date("2026-04-10T08:00:00+09:00"),
          deliveredAt: new Date("2026-04-11T10:30:00+09:00")
        }
      }
    }
  });
}

async function main() {
  // 개발 전용 더미 데이터(테스트 계정·샘플 주문)는 SEED_DEV_DATA=1 일 때만
  // 주입. 프로덕션 시드에는 카테고리와 상품 카탈로그만 넣는다.
  const includeDevData = process.env.SEED_DEV_DATA === "1";

  const categories = seedCategoriesData;
  const products = seedProductsData;

  const real = await seedCategories(categories);
  const labelMap = buildCategoryLabelMap(real);
  await seedProducts(products, labelMap);

  if (includeDevData) {
    await seedDevUsers();
    await seedSampleOrders();
  }

  const [categoryCount, productCount, userCount, orderCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.count()
  ]);

  console.log(`✓ Category 시드 완료: ${categoryCount}건`);
  console.log(`✓ Product 시드 완료: ${productCount}건`);
  if (includeDevData) {
    console.log(`✓ User 시드 완료: ${userCount}건 (admin/user/biz 테스트 계정)`);
    console.log(`✓ Order 시드 완료: ${orderCount}건 (biz 계정 샘플 주문)`);
  } else {
    console.log(
      `ℹ SEED_DEV_DATA 미설정 — 테스트 계정·샘플 주문은 건너뜀 (User=${userCount}, Order=${orderCount})`
    );
  }
}

main()
  .catch((error) => {
    console.error("seed 실패:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
