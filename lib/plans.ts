import { SubscriptionPlan } from './types';

export interface PlanConfig {
  maxInvoicesPerMonth: number;
  hasBranding: boolean;
  features: string[];
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanConfig> = {
  free: {
    maxInvoicesPerMonth: 5,
    hasBranding: true,
    features: [
      '5 factures / mois',
      'Gestion des clients',
      'TVA automatique (18%)',
      'Export PDF',
      'Logo iziFacture sur les factures',
    ],
  },
  pro: {
    maxInvoicesPerMonth: Infinity,
    hasBranding: false,
    features: [
      'Factures illimitées',
      'Sans logo iziFacture',
      'Multi-devises (FCFA, EUR, USD)',
      'Relances WhatsApp automatiques',
      'Numérotation personnalisée',
      'Support prioritaire',
    ],
  },
  business: {
    maxInvoicesPerMonth: Infinity,
    hasBranding: false,
    features: [
      'Tout le plan Pro',
      'Multi-utilisateurs (jusqu’à 5)',
      'API & intégrations',
      'Rapports avancés',
      'Gestionnaire de compte dédié',
    ],
  },
};

export const PLAN_PRICES: Record<SubscriptionPlan, { monthly: number; annual: number }> = {
  free: { monthly: 0, annual: 0 },
  pro: { monthly: 5000, annual: 4000 },
  business: { monthly: 15000, annual: 12000 },
};

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  free: 'Gratuit',
  pro: 'Pro',
  business: 'Business',
};

export function getPlanConfig(plan: SubscriptionPlan): PlanConfig {
  return PLAN_LIMITS[plan];
}

/**
 * Compte le nombre de factures émises ce mois-ci et indique
 * si l'utilisateur approche ou a atteint sa limite.
 */
export function getLimitStatus(
  currentCount: number,
  plan: SubscriptionPlan,
): { count: number; max: number; isAtLimit: boolean; isNearLimit: boolean; remaining: number } {
  const config = PLAN_LIMITS[plan];
  const max = config.maxInvoicesPerMonth;
  const remaining = max === Infinity ? Infinity : Math.max(0, max - currentCount);
  const isAtLimit = max !== Infinity && currentCount >= max;
  const isNearLimit = max !== Infinity && currentCount >= max - 1 && !isAtLimit;
  return { count: currentCount, max, isAtLimit, isNearLimit, remaining };
}