const PAYPAL_SANDBOX = process.env.PAYPAL_ENV === 'sandbox';
const PAYPAL_API_URL = PAYPAL_SANDBOX
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Obtient un token d'accès OAuth 2.0 auprès de PayPal.
 */
export async function getAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are not configured.');
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const credentials = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  const res = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal OAuth error (${res.status}): ${text}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ? Number(data.expires_in) * 1000 : 32_400_000),
  };

  return data.access_token;
}

/**
 * Crée une commande PayPal (Orders API v2).
 * L'utilisateur est redirigé vers l'URL d'approbation PayPal.
 * PayPal gère à la fois les paiements PayPal et les cartes bancaires (guest checkout).
 *
 * @param amountUsd - Montant en USD (PayPal ne supporte pas XOF)
 * @param paymentId - Référence interne (stockée dans custom_id)
 * @param appUrl - URL de base de l'application
 */
export async function createOrder(
  amountUsd: number,
  paymentId: string,
  appUrl: string,
): Promise<{ id: string; approvalUrl: string | null }> {
  const accessToken = await getAccessToken();

  const res = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amountUsd.toFixed(2),
          },
          custom_id: paymentId,
          description: 'IziFacture subscription',
        },
      ],
      application_context: {
        return_url: `${appUrl}/api/payments/success?provider=paypal`,
        cancel_url: `${appUrl}/api/payments/cancel?provider=paypal`,
        brand_name: 'IziFacture',
        user_action: 'PAY_NOW',
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal create order error (${res.status}): ${text}`);
  }

  const data = await res.json();

  // Trouver l'URL d'approbation dans les liens
  const approvalLink = data.links?.find((link: any) => link.rel === 'approve');

  return { id: data.id, approvalUrl: approvalLink?.href ?? null };
}

/**
 * Capture une commande PayPal après approbation de l'utilisateur.
 */
export async function captureOrder(orderId: string): Promise<any> {
  const accessToken = await getAccessToken();

  const res = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal capture error (${res.status}): ${text}`);
  }

  return res.json();
}

/**
 * Vérifie la signature d'un webhook PayPal en appelant l'API de vérification.
 */
export async function verifyWebhook(
  headers: Record<string, string>,
  body: string,
): Promise<any> {
  const accessToken = await getAccessToken();
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    throw new Error('PAYPAL_WEBHOOK_ID is not configured.');
  }

  const verificationData = {
    auth_algo: headers['paypal-auth-algo'],
    cert_url: headers['paypal-cert-url'],
    transmission_id: headers['paypal-transmission-id'],
    transmission_sig: headers['paypal-transmission-sig'],
    transmission_time: headers['paypal-transmission-time'],
    webhook_id: webhookId,
    webhook_event: JSON.parse(body),
  };

  const res = await fetch(`${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(verificationData),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal webhook verification error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.verification_status; // 'SUCCESS' ou 'FAILURE'
}

export const paypalService = {
  getAccessToken,
  createOrder,
  captureOrder,
  verifyWebhook,
};