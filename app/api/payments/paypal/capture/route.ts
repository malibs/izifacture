import { NextRequest, NextResponse } from 'next/server';
import { paypalService } from '@/lib/services/paypalService';
import {
  activateSubscription,
  updatePaymentStatus,
  getPaymentById,
} from '@/lib/services/subscriptionService';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // 1. Capturer la commande PayPal
    const captureData = await paypalService.captureOrder(orderId);

    // 2. Extraire le payment_id depuis custom_id
    const paymentId = captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id
      || captureData?.purchase_units?.[0]?.custom_id;

    if (!paymentId) {
      // Le webhook traitera le paiement de toute façon
      return NextResponse.json({ success: true, message: 'Order captured' });
    }

    // 3. Vérifier le statut de la capture
    const captureStatus = captureData?.purchase_units?.[0]?.payments?.captures?.[0]?.status;

    if (captureStatus === 'COMPLETED') {
      const payment = await getPaymentById(paymentId);
      if (payment && payment.status === 'pending') {
        await updatePaymentStatus(paymentId, 'approved', orderId);
        await activateSubscription(payment.user_id, payment.plan, payment.billing_cycle);
        console.log(`[PayPal Capture] Subscription activated for user ${payment.user_id}`);
      }
    }

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('PayPal capture error:', err);
    return NextResponse.json(
      { error: err.message || 'Capture failed' },
      { status: 500 },
    );
  }
}