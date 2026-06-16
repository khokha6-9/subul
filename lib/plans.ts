export interface PlanInfo {
  credits: number;
  nameAr: string;
  priceUsd: number;
  durationDays: number;
}

export const PLAN_INFO: Record<string, PlanInfo> = {
  starter: {
    credits: 100,
    nameAr: 'سُبُل ستارتر',
    priceUsd: 1,
    durationDays: 30,
  },
  plus: {
    credits: 400,
    nameAr: 'سُبُل بلس',
    priceUsd: 3,
    durationDays: 30,
  },
  pro: {
    credits: 1200,
    nameAr: 'سُبُل برو',
    priceUsd: 7,
    durationDays: 30,
  },
};

export function getPlanInfo(planId: string): PlanInfo | null {
  return PLAN_INFO[planId] || null;
}

export function calculateExpiryDate(planId: string): Date {
  const plan = getPlanInfo(planId);
  const now = new Date();
  now.setDate(now.getDate() + (plan?.durationDays || 30));
  return now;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}