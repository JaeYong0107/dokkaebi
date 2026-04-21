import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import { join } from "node:path";

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

type CategorySeed = {
  id: string;
  name: string;
  icon: string;
  productCategories?: string[];
  featured?: boolean;
};

type ProductSeed = {
  id: string;
  sku?: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  basePrice: number;
  normalDiscountRate: number;
  businessDiscountRate: number;
  origin: string;
  imageUrl?: string;
  imageEmoji?: string;
  imageBg?: string;
  badges?: string[];
  isActive: boolean;
  stockQuantity?: number;
};

function loadJson<T>(relativePath: string): T {
  const fullPath = join(process.cwd(), relativePath);
  return JSON.parse(readFileSync(fullPath, "utf8")) as T;
}

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

async function main() {
  const categories = loadJson<CategorySeed[]>("data/categories.json");
  const products = loadJson<ProductSeed[]>("data/products.json");

  const real = await seedCategories(categories);
  const labelMap = buildCategoryLabelMap(real);
  await seedProducts(products, labelMap);
  await seedDevUsers();

  const [categoryCount, productCount, userCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.user.count()
  ]);

  console.log(`✓ Category 시드 완료: ${categoryCount}건`);
  console.log(`✓ Product 시드 완료: ${productCount}건`);
  console.log(`✓ User 시드 완료: ${userCount}건 (admin/user/biz 테스트 계정)`);
}

main()
  .catch((error) => {
    console.error("seed 실패:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
