import { NextRequest, NextResponse } from 'next/server';
import { waveService } from '@/lib/services/waveService';
import {
  activateSubscription,
  updatePaymentStatus,
  getPaymentById,
} from '@/lib/services/subscriptionService';

export async function POST(request: NextRequest) {
  try {
    // 1. Lire le raw body et le header de signature
    const rawBody = await request.text();
    const signatureHeader = request.headers.get('wave-signature');

    const webhookSecret = process.env.WAVE_WEBHOOK_SECRET || process.env.WAVE_API_KEY;
    if (!webhookSecret) {
      console.error('Wave webhook secret not configured');
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    // 2. Vérifier la signature HMAC-SHA256
    const isValid = waveService.verifyWebhookSignature(rawBody, signatureHeader, webhookSecret);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // 3. Extraire la référence du paiement
    const paymentId = event.client_reference || event.data?.client_reference;
    if (!paymentId) {
      return NextResponse.json({ received: true }); // Pas une erreur, juste ignorer
    }

    // 4. Vérifier le statut de la session via l'API Wave
    const sessionId = event.id || event.checkout_session_id;
    if (sessionId) {
      const session = await waveService.getCheckoutSession(sessionId);
      if (session.status === 'succeeded') {
        // 5. Activer l'abonnement
        const payment = await getPaymentById(paymentId);
        if (payment && payment.status === 'pending') {
          await updatePaymentStatus(paymentId, 'approved', sessionId);
          await activateSubscription(payment.user_id, payment.plan, payment.billing_cycle);
          console.log(`[Wave] Subscription activated for user ${payment.user_id}`);
        }
      } else if (session.status === 'expired' || session.status === 'failed') {
        await updatePaymentStatus(paymentId, 'declined', sessionId);
      }
    }

    return NextResponse.json({ received: true });

  } catch (err: any) {
    console.error('Wave webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}