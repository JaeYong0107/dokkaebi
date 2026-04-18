const DEFAULT_POLICY = {
  DEFAULT_SHIPPING_FEE: 3000,
  FREE_SHIPPING_THRESHOLD: 50000,
  MIN_ORDER_NORMAL: 10000,
  MIN_ORDER_BUSINESS: 50000
} as const;

type PolicyKey = keyof typeof DEFAULT_POLICY;

export function getPolicyConfig(key: PolicyKey) {
  const value = process.env[key];
  const parsed = Number(value);

  if (Number.isFinite(parsed)) {
    return parsed;
  }

  return DEFAULT_POLICY[key];
}
