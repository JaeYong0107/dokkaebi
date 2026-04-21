export type PolicyValues = {
  defaultShippingFee: number;
  freeShippingThreshold: number;
  minOrderNormal: number;
  minOrderBusiness: number;
};

export const POLICY_KEYS = [
  "defaultShippingFee",
  "freeShippingThreshold",
  "minOrderNormal",
  "minOrderBusiness"
] as const satisfies ReadonlyArray<keyof PolicyValues>;

export type PolicyKey = (typeof POLICY_KEYS)[number];

export const POLICY_LABELS: Record<PolicyKey, { title: string; hint: string }> = {
  defaultShippingFee: {
    title: "기본 배송비",
    hint: "일반 주문에 적용되는 기본 배송비(원)"
  },
  freeShippingThreshold: {
    title: "무료배송 기준",
    hint: "이 금액 이상 주문 시 배송비 무료(원)"
  },
  minOrderNormal: {
    title: "일반 회원 최소 주문",
    hint: "일반 고객의 최소 주문 금액(원)"
  },
  minOrderBusiness: {
    title: "사업자 최소 주문",
    hint: "사업자 회원의 최소 주문 금액(원)"
  }
};
