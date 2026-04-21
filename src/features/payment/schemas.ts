import { z } from "zod";

export const paymentMethodSchema = z.enum([
  "easy",
  "card",
  "transfer",
  "phone",
  "naver",
  "deposit"
]);

export const checkoutRequestSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive()
      })
    )
    .min(1, "주문 품목이 최소 1개 이상이어야 합니다"),
  customerType: z.enum(["NORMAL", "BUSINESS"]),
  paymentMethod: paymentMethodSchema,
  recipient: z.string().min(1, "수취인을 입력해 주세요").max(50),
  recipientPhone: z.string().optional(),
  shippingAddress: z.string().min(1, "배송지를 입력해 주세요").max(200),
  shippingMemo: z.string().max(200).optional(),
  taxInvoiceRequested: z.boolean().optional()
});
