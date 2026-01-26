export const PLANS = ['trial', 'premium', 'lifetime'] as const;

export type Plan = (typeof PLANS)[number];
