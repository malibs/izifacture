import { NextRequest, NextResponse } from 'next/server';
import { paypalService } from '@/lib/services/paypalService';
import {
  activateSubscription,
  updatePaymentStatus,
  getPaymentById,
} from '@/lib/services/subscriptionService';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // 1. Collecter les headers PayPal nécessaires à la vérification
    const headers: Record<string, string> = {};
    const headerNames = [
      'paypal-auth-algo',
      'paypal-cert-url',
      'paypal-transmission-id',
      'paypal-transmission-sig',
      'paypal-transmission-time',
    ];
    for (const name of headerNames) {
      const value = request.headers.get(name);
      if (value) headers[name] = value;
    }

    // 2. Vérifier la signature du webhook via l'API PayPal
    let verified = false;
    try {
      verified = (await paypalService.verifyWebhook(headers, rawBody)) === 'SUCCESS';
    } catch (err) {
      // Si la vérification échoue (clés non configurées en dev), on logge mais on continue
      console.error('[PayPal] Webhook verification failed:', err);
      return NextResponse.json({ error: 'Verification failed' }, { status: 401 });
    }

    if (!verified) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 3. Parser l'événement
    const event = JSON.parse(rawBody);
    const eventType = event.event_type;

    // 4. Traiter les événements de paiement
    if (eventType === 'CHECKOUT.ORDER.APPROVED' || eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const paymentId = event.resource?.custom_id || event.resource?.purchase_units?.[0]?.custom_id;

      if (paymentId) {
        const payment = await getPaymentById(paymentId);
        if (payment && payment.status === 'pending') {
          await updatePaymentStatus(paymentId, 'approved', event.resource?.id);
          await activateSubscription(payment.user_id, payment.plan, payment.billing_cycle);
          console.log(`[PayPal] Subscription activated for user ${payment.user_id}`);
        }
      }
    }

    return NextResponse.json({ received: true });

  } catch (err: any) {
    console.error('PayPal webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}