import { createAdminClient } from '@/lib/supabase-server';
import { BillingCycle, PaymentProvider, SubscriptionPlan } from '@/lib/types';

/**
 * Active un abonnement après un paiement réussi.
 * Met à jour le profil de l'utilisateur avec le nouveau plan et la date d'expiration.
 * Utilise le admin client (service role) car appelé depuis les webhooks.
 */
export async function activateSubscription(
  userId: string,
  plan: SubscriptionPlan,
  billingCycle: BillingCycle,
): Promise<void> {
  const supabase = createAdminClient();

  const now = new Date();
  const endsAt = new Date(now);
  endsAt.setDate(endsAt.getDate() + (billingCycle === 'annual' ? 365 : 30));

  const { error } = await supabase
    .from('profiles')
    .update({
      subscription_plan: plan,
      subscription_status: 'active',
      subscription_ends_at: endsAt.toISOString(),
    })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to activate subscription: ${error.message}`);
  }
}

/**
 * Met à jour le statut d'un paiement dans la DB.
 */
export async function updatePaymentStatus(
  paymentId: string,
  status: 'approved' | 'declined' | 'canceled',
  providerReference?: string,
): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('payments')
    .update({
      status,
      provider_reference: providerReference,
      updated_at: new Date().toISOString(),
    })
    .eq('id', paymentId);

  if (error) {
    console.error('Failed to update payment status:', error);
  }
}

/**
 * Récupère un paiement par son ID (depuis un webhook, avec le admin client).
 */
export async function getPaymentById(paymentId: string): Promise<any | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single();

  if (error) {
    console.error('Failed to get payment:', error);
    return null;
  }

  return data;
}

/**
 * Récupère un paiement par son notif_token (pour les webhooks Orange Money).
 */
export async function getPaymentByNotifToken(notifToken: string): Promise<any | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('notif_token', notifToken)
    .single();

  if (error) {
    console.error('Failed to get payment by notif_token:', error);
    return null;
  }

  return data;
}