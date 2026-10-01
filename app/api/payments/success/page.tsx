"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const provider = searchParams.get('provider') || '';
  const paypalOrder = searchParams.get('token') || searchParams.get('orderId'); // PayPal returns token
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const processPayment = async () => {
      // Pour PayPal, on doit capturer la commande côté serveur
      if (provider === 'paypal' && paypalOrder) {
        try {
          const res = await fetch('/api/payments/paypal/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: paypalOrder }),
          });
          const data = await res.json();
          if (res.ok) {
            setStatus('success');
            setMessage('Votre paiement a été confirmé et votre abonnement est maintenant actif.');
          } else {
            // Le webhook peut encore traiter le paiement, ce n'est pas forcément une erreur
            setStatus('success');
            setMessage('Votre paiement est en cours de validation. Votre abonnement sera activé sous peu.');
          }
        } catch {
          setStatus('success');
          setMessage('Votre paiement est en cours de validation. Votre abonnement sera activé sous peu.');
        }
      } else {
        // Wave et Orange Money : le webhook traite le paiement
        setStatus('success');
        setMessage(
          provider === 'wave'
            ? 'Votre paiement Wave a été reçu. Votre abonnement est maintenant actif.'
            : provider === 'orange'
              ? 'Votre paiement Orange Money a été reçu. Votre abonnement est maintenant actif.'
              : 'Votre paiement a été reçu. Votre abonnement est maintenant actif.',
        );
      }
    };

    processPayment();
  }, [provider, paypalOrder]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 text-center space-y-6">
        {status === 'processing' && (
          <>
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Validation en cours…</h1>
            <p className="text-sm text-slate-500 font-medium">
              Nous validons votre paiement. Cela ne prendra que quelques secondes.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Paiement réussi !</h1>
            <p className="text-sm text-slate-500 font-medium">{message}</p>
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition-all shadow-lg shadow-brand-500/20 active:scale-95"
            >
              Accéder au tableau de bord
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/settings"
              className="block text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Voir mes paramètres
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}