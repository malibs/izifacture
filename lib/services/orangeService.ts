const ORANGE_API_URL = 'https://api.orange.com';
const ORANGE_CLIENT_ID = process.env.ORANGE_CLIENT_ID;
const ORANGE_CLIENT_SECRET = process.env.ORANGE_CLIENT_SECRET;
const ORANGE_MERCHANT_KEY = process.env.ORANGE_MERCHANT_KEY;

// Le token OAuth est valide ~90 jours, on le met en cache
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Obtient un token d'accès OAuth 2.0 auprès d'Orange Money.
 * Le token est mis en cache pour éviter de le redemander à chaque appel.
 */
export async function getAccessToken(): Promise<string> {
  if (!ORANGE_CLIENT_ID || !ORANGE_CLIENT_SECRET) {
    throw new Error('ORANGE_CLIENT_ID and ORANGE_CLIENT_SECRET are not configured.');
  }

  // Utiliser le token en cache s'il est encore valide
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  const credentials = Buffer.from(`${ORANGE_CLIENT_ID}:${ORANGE_CLIENT_SECRET}`).toString('base64');

  const res = await fetch(`${ORANGE_API_URL}/oauth/v3/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Orange OAuth error (${res.status}): ${text}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ? Number(data.expires_in) * 1000 : 86_400_000),
  };

  return data.access_token;
}

/**
 * Crée une demande de paiement Orange Money Web Payment.
 * L'utilisateur est redirigé vers payment_url pour payer.
 *
 * @param amountXof - Montant en FCFA
 * @param paymentId - Référence interne (ID du payment record)
 * @param appUrl - URL de base de l'application
 * @returns pay_token, payment_url, notif_token
 */
export async function createWebPayment(
  amountXof: number,
  paymentId: string,
  appUrl: string,
): Promise<{ pay_token: string; payment_url: string; notif_token: string }> {
  if (!ORANGE_MERCHANT_KEY) {
    throw new Error('ORANGE_MERCHANT_KEY is not configured.');
  }

  const accessToken = await getAccessToken();

  // En production: /sn/v1, en sandbox: /dev/v1
  const envPath = process.env.ORANGE_ENV === 'sandbox' ? 'dev' : 'sn';

  const res = await fetch(
    `${ORANGE_API_URL}/orange-money-webpay/${envPath}/v1/webpayment`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchant_key: ORANGE_MERCHANT_KEY,
        currency: 'XOF',
        order_id: paymentId,
        amount: Math.round(amountXof),
        return_url: `${appUrl}/api/payments/success?provider=orange`,
        cancel_url: `${appUrl}/api/payments/cancel?provider=orange`,
        notif_url: `${appUrl}/api/payments/webhook/orange`,
        lang: 'fr',
        reference: paymentId,
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Orange Web Payment error (${res.status}): ${text}`);
  }

  const data = await res.json();

  if (data.status !== 201 && data.status !== 200) {
    throw new Error(`Orange Web Payment failed: ${data.message}`);
  }

  return {
    pay_token: data.pay_token,
    payment_url: data.payment_url,
    notif_token: data.notif_token,
  };
}

/**
 * Vérifie le statut d'une transaction Orange Money.
 */
export async function getTransactionStatus(
  payToken: string,
  amount: number,
  orderId: string,
): Promise<{ status: string; txnid?: string }> {
  const accessToken = await getAccessToken();
  const envPath = process.env.ORANGE_ENV === 'sandbox' ? 'dev' : 'sn';

  const res = await fetch(
    `${ORANGE_API_URL}/orange-money-webpay/${envPath}/v1/transactionstatus`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        amount: Math.round(amount),
        pay_token: payToken,
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Orange status check error (${res.status}): ${text}`);
  }

  return res.json();
}

export const orangeService = {
  getAccessToken,
  createWebPayment,
  getTransactionStatus,
};