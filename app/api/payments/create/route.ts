import { NextRequest, NextResponse } from 'next/server';
import { createClientFromRequest } from '@/lib/supabase-server';
import { waveService } from '@/lib/services/waveService';
import { orangeService } from '@/lib/services/orangeService';
import { paypalService } from '@/lib/services/paypalService';
import { PLAN_PRICES, PLAN_PRICES_USD } from '@/lib/plans';
import { PaymentProvider, BillingCycle, SubscriptionPlan } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // 1. Authentifier l'utilisateur
    const supabase = await createClientFromRequest();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // 2. Valider le body
    const body = await request.json();
    const { provider, plan, billingCycle } = body as {
      provider: PaymentProvider;
      plan: 'pro' | 'business';
      billingCycle: BillingCycle;
    };

    if (!provider || !plan || !billingCycle) {
      return NextResponse.json(
        { error: 'provider, plan et billingCycle sont requis' },
        { status: 400 },
      );
    }

    if (!['wave', 'orange', 'paypal'].includes(provider)) {
      return NextResponse.json({ error: 'Fournisseur invalide' }, { status: 400 });
    }

    if (!['pro', 'business'].includes(plan)) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });
    }

    if (!['monthly', 'annual'].includes(billingCycle)) {
      return NextResponse.json({ error: 'Cycle de facturation invalide' }, { status: 400 });
    }

    // 3. Calculer le montant selon le fournisseur et le cycle
    const isPaypal = provider === 'paypal';
    const prices = isPaypal ? PLAN_PRICES_USD : PLAN_PRICES;
    const amount = prices[plan as SubscriptionPlan][billingCycle];
    const currency = isPaypal ? 'USD' : 'XOF';

    if (amount === 0) {
      return NextResponse.json({ error: 'Le plan gratuit ne nécessite pas de paiement' }, { status: 400 });
    }

    // 4. Créer un enregistrement de paiement pending
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        plan,
        billing_cycle: billingCycle,
        amount,
        currency,
        provider,
        status: 'pending',
      })
      .select()
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du paiement' },
        { status: 500 },
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 5. Appeler le service du fournisseur approprié
    let redirectUrl: string;

    if (provider === 'wave') {
      const session = await waveService.createCheckoutSession(amount, payment.id, appUrl);
      // Mettre à jour la référence
      await supabase
        .from('payments')
        .update({ provider_reference: session.id })
        .eq('id', payment.id);
      redirectUrl = session.wave_launch_url;

    } else if (provider === 'orange') {
      const result = await orangeService.createWebPayment(amount, payment.id, appUrl);
      // Stocker le notif_token pour la vérification du webhook
      await supabase
        .from('payments')
        .update({
          provider_reference: result.pay_token,
          notif_token: result.notif_token,
        })
        .eq('id', payment.id);
      redirectUrl = result.payment_url;

    } else {
      // PayPal
      const order = await paypalService.createOrder(amount, payment.id, appUrl);
      if (!order.approvalUrl) {
        throw new Error('PayPal n\'a pas retourné d\'URL d\'approbation');
      }
      await supabase
        .from('payments')
        .update({ provider_reference: order.id })
        .eq('id', payment.id);
      redirectUrl = order.approvalUrl;
    }

    // 6. Retourner l'URL de redirection
    return NextResponse.json({ redirectUrl });

  } catch (err: any) {
    console.error('Payment creation error:', err);
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la création du paiement' },
      { status: 500 },
    );
  }
}