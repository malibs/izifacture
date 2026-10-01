import crypto from 'crypto';

const WAVE_API_URL = 'https://api.wave.com';
const WAVE_API_KEY = process.env.WAVE_API_KEY;

/**
 * Crée une session de checkout Wave.
 * L'utilisateur est redirigé vers wave_launch_url pour payer.
 *
 * @param amountXof - Montant en FCFA (entier, pas de décimales)
 * @param paymentId - Référence interne (ID du payment record)
 * @param appUrl - URL de base de l'application (pour les URLs de retour)
 */
export async function createCheckoutSession(
  amountXof: number,
  paymentId: string,
  appUrl: string,
): Promise<{ id: string; wave_launch_url: string }> {
  if (!WAVE_API_KEY) {
    throw new Error('WAVE_API_KEY is not configured.');
  }

  const res = await fetch(`${WAVE_API_URL}/v1/checkout/sessions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WAVE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: String(Math.round(amountXof)), // Wave exige une string, pas de décimales pour XOF
      currency: 'XOF',
      success_url: `${appUrl}/api/payments/success?provider=wave`,
      error_url: `${appUrl}/api/payments/cancel?provider=wave`,
      client_reference: paymentId,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Wave API error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return { id: data.id, wave_launch_url: data.wave_launch_url };
}

/**
 * Récupère le statut d'une session de checkout Wave.
 */
export async function getCheckoutSession(sessionId: string): Promise<any> {
  if (!WAVE_API_KEY) throw new Error('WAVE_API_KEY is not configured.');

  const res = await fetch(`${WAVE_API_URL}/v1/checkout/sessions/${sessionId}`, {
    headers: { 'Authorization': `Bearer ${WAVE_API_KEY}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Wave API error (${res.status}): ${text}`);
  }

  return res.json();
}

/**
 * Vérifie la signature HMAC-SHA256 d'un webhook Wave.
 *
 * Wave envoie un header `Wave-Signature` au format: `t=timestamp,v1=signature`
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader) return false;

  const parts = signatureHeader.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  const timestamp = parts['t'];
  const signature = parts['v1'];

  if (!timestamp || !signature) return false;

  // Le payload signé est: timestamp + rawBody
  const signedPayload = `${timestamp}${rawBody}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex'),
  );
}

export const waveService = {
  createCheckoutSession,
  getCheckoutSession,
  verifyWebhookSignature,
};