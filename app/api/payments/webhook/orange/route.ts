import { NextRequest, NextResponse } from 'next/server';
import {
  activateSubscription,
  updatePaymentStatus,
  getPaymentByNotifToken,
} from '@/lib/services/subscriptionService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Orange Money envoie: { status, notif_token, txnid }
    const { status, notif_token, txnid } = body;

    if (!notif_token) {
      return NextResponse.json({ received: true });
    }

    // 1. Trouver le paiement par notif_token
    const payment = await getPaymentByNotifToken(notif_token);
    if (!payment) {
      console.error('[Orange] Payment not found for notif_token:', notif_token);
      return NextResponse.json({ received: true });
    }

    // 2. Vérifier le statut
    if (status === 'SUCCESS') {
      if (payment.status === 'pending') {
        await updatePaymentStatus(payment.id, 'approved', txnid);
        await activateSubscription(payment.user_id, payment.plan, payment.billing_cycle);
        console.log(`[Orange] Subscription activated for user ${payment.user_id}`);
      }
    } else if (status === 'FAILED' || status === 'CANCEL') {
      await updatePaymentStatus(payment.id, 'declined', txnid);
    }

    return NextResponse.json({ received: true });

  } catch (err: any) {
    console.error('Orange webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}