"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, ArrowRight } from 'lucide-react';

function CancelContent() {
  const searchParams = useSearchParams();
  const provider = searchParams.get('provider') || '';

  const providerLabel =
    provider === 'wave' ? 'Wave' :
    provider === 'orange' ? 'Orange Money' :
    provider === 'paypal' ? 'PayPal' : 'le paiement';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Paiement annulé</h1>
        <p className="text-sm text-slate-500 font-medium">
          Votre paiement via {providerLabel} a été annulé. Aucun montant n'a été débité.
          Vous pouvez réessayer à tout moment depuis vos paramètres.
        </p>
        <Link
          href="/dashboard/settings"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all active:scale-95"
        >
          Retour aux paramètres
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/dashboard"
          className="block text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
        >
          Tableau de bord
        </Link>
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Chargement…
      </div>
    }>
      <CancelContent />
    </Suspense>
  );
}