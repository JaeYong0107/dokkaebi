import { prisma } from "@/lib/prisma";
import {
  POLICY_KEYS,
  type PolicyKey,
  type PolicyValues
} from "./types";

function envFallback(key: PolicyKey): number {
  const raw =
    key === "defaultShippingFee"
      ? process.env.DEFAULT_SHIPPING_FEE
      : key === "freeShippingThreshold"
        ? process.env.FREE_SHIPPING_THRESHOLD
        : key === "minOrderNormal"
          ? process.env.MIN_ORDER_NORMAL
          : process.env.MIN_ORDER_BUSINESS;
  if (raw === undefined || raw === "") return DEFAULTS[key];
  const n = Number(raw);
  return Number.isFinite(n) ? n : DEFAULTS[key];
}

const DEFAULTS: PolicyValues = {
  defaultShippingFee: 3000,
  freeShippingThreshold: 50000,
  minOrderNormal: 10000,
  minOrderBusiness: 50000
};

export async function getPolicyValues(): Promise<PolicyValues> {
  const rows = await prisma.policy.findMany({
    where: { key: { in: [...POLICY_KEYS] } }
  });
  const stored = new Map(rows.map((r) => [r.key, r.value]));

  const result = {} as PolicyValues;
  for (const key of POLICY_KEYS) {
    const raw = stored.get(key);
    if (raw !== undefined && raw !== "") {
      const n = Number(raw);
      result[key] = Number.isFinite(n) ? n : envFallback(key);
    } else {
      result[key] = envFallback(key);
    }
  }
  return result;
}

export async function upsertPolicyValues(partial: Partial<PolicyValues>) {
  const entries = Object.entries(partial).filter(
    ([key]) => (POLICY_KEYS as readonly string[]).includes(key)
  ) as Array<[PolicyKey, number]>;

  for (const [key, value] of entries) {
    await prisma.policy.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    });
  }

  return getPolicyValues();
}
