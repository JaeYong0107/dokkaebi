import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const prisma = new PrismaClient();

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

async function main() {
  const categories = loadJson<CategorySeed[]>("data/categories.json");
  const products = loadJson<ProductSeed[]>("data/products.json");

  const real = await seedCategories(categories);
  const labelMap = buildCategoryLabelMap(real);
  await seedProducts(products, labelMap);

  const [categoryCount, productCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count()
  ]);

  console.log(`✓ Category 시드 완료: ${categoryCount}건`);
  console.log(`✓ Product 시드 완료: ${productCount}건`);
}

main()
  .catch((error) => {
    console.error("seed 실패:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
