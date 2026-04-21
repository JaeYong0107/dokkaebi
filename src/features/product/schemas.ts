import { z } from "zod";

const BADGE_MAX = 5;

const baseShape = {
  name: z.string().min(1, "상품명을 입력하세요").max(100),
  description: z.string().min(1, "설명을 입력하세요").max(1000),
  sku: z.string().max(40).optional().nullable(),
  unit: z.string().min(1, "단위를 입력하세요").max(40),
  basePrice: z
    .number()
    .int("정가는 정수여야 합니다")
    .positive("정가는 0보다 커야 합니다"),
  normalDiscountRate: z.number().min(0).max(100).default(0),
  businessDiscountRate: z.number().min(0).max(100).default(0),
  origin: z.string().min(1, "원산지를 입력하세요").max(100),
  imageUrl: z.string().url().optional().nullable(),
  imageEmoji: z.string().max(8).optional().nullable(),
  imageBg: z.string().max(80).optional().nullable(),
  badges: z.array(z.string().max(30)).max(BADGE_MAX).default([]),
  minOrderQty: z.number().int().positive().default(1),
  stockQuantity: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  categoryId: z.string().min(1, "카테고리를 선택하세요")
};

export const createProductSchema = z.object({
  id: z.string().min(1, "상품 ID 를 입력하세요").max(60),
  ...baseShape
});

export const updateProductSchema = z.object({
  name: baseShape.name.optional(),
  description: baseShape.description.optional(),
  sku: baseShape.sku,
  unit: baseShape.unit.optional(),
  basePrice: baseShape.basePrice.optional(),
  normalDiscountRate: baseShape.normalDiscountRate.optional(),
  businessDiscountRate: baseShape.businessDiscountRate.optional(),
  origin: baseShape.origin.optional(),
  imageUrl: baseShape.imageUrl,
  imageEmoji: baseShape.imageEmoji,
  imageBg: baseShape.imageBg,
  badges: baseShape.badges.optional(),
  minOrderQty: baseShape.minOrderQty.optional(),
  stockQuantity: baseShape.stockQuantity.optional(),
  isActive: baseShape.isActive.optional(),
  categoryId: baseShape.categoryId.optional()
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
