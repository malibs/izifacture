"use client";

import React, { useState } from 'react';
import { X, Loader2, Crown, Zap, CheckCircle, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SubscriptionPlan, BillingCycle, PaymentProvider } from '@/lib/types';
import { PLAN_LIMITS, PLAN_PRICES, PLAN_PRICES_USD, PLAN_LABELS } from '@/lib/plans';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: 'pro' | 'business';
}

const PAYMENT_METHODS: {
  id: PaymentProvider;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  color: string;
}[] = [
  {
    id: 'wave',
    label: 'Wave',
    description: 'Paiement instantané',
    icon: <Smartphone className="w-5 h-5" />,
    color: 'bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-400',
  },
  {
    id: 'orange',
    label: 'Orange Money',
    description: 'Paiement sécurisé',
    icon: <Smartphone className="w-5 h-5" />,
    color: 'bg-orange-50 text-orange-600 border-orange-200 hover:border-orange-400',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    description: 'Compte PayPal',
    icon: <Wallet className="w-5 h-5" />,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:border-indigo-400',
  },
  {
    id: 'paypal',
    label: 'Carte bancaire',
    description: 'Visa, Mastercard',
    icon: <CreditCard className="w-5 h-5" />,
    badge: 'via PayPal',
    color: 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400',
  },
];

export function PaymentModal({ isOpen, onClose, plan }: PaymentModalProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [loadingProvider, setLoadingProvider] = useState<PaymentProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const planConfig = PLAN_LIMITS[plan];
  const fcfaPrice = PLAN_PRICES[plan][billingCycle];
  const usdPrice = PLAN_PRICES_USD[plan][billingCycle];

  const handlePayment = async (provider: PaymentProvider) => {
    setError(null);
    setLoadingProvider(provider);

    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, plan, billingCycle }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création du paiement');
      }

      // Rediriger vers la page de paiement du fournisseur
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('URL de redirection manquante');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      setLoadingProvider(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Passer au plan {PLAN_LABELS[plan]}</h3>
              <p className="text-xs text-slate-400 font-medium">Choisissez votre mode de paiement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loadingProvider !== null}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Résumé du plan */}
          <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-bold text-slate-900">Plan {PLAN_LABELS[plan]}</span>
            </div>
            <div className="space-y-1.5">
              {planConfig.features.slice(0, 4).map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Toggle mensuel / annuel */}
          <div className="flex items-center bg-slate-100 rounded-2xl p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              disabled={loadingProvider !== null}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all",
                billingCycle === 'monthly'
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              disabled={loadingProvider !== null}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all relative",
                billingCycle === 'annual'
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              Annuel
              <span className="absolute -top-1 -right-1 text-[8px] font-black bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>

          {/* Prix */}
          <div className="text-center">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {fcfaPrice.toLocaleString('fr-FR')} FCFA
            </span>
            <span className="text-sm text-slate-400 font-medium">/{billingCycle === 'monthly' ? 'mois' : 'an'}</span>
            <p className="text-xs text-slate-400 mt-1">
              ou {usdPrice} USD {billingCycle === 'monthly' ? '/ mois' : '/ an'} via PayPal
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Méthodes de paiement */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
              Méthode de paiement
            </p>
            {PAYMENT_METHODS.map((method, idx) => (
              <button
                key={`${method.id}-${idx}`}
                onClick={() => handlePayment(method.id)}
                disabled={loadingProvider !== null}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all active:scale-[0.98] disabled:opacity-50",
                  method.color,
                )}
              >
                {loadingProvider === method.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  method.icon
                )}
                <div className="flex-1 text-left">
                  <span className="text-sm font-bold flex items-center gap-2">
                    {method.label}
                    {method.badge && (
                      <span className="text-[9px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full">
                        {method.badge}
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-slate-400 font-medium block">
                    {loadingProvider === method.id
                      ? 'Redirection en cours…'
                      : method.description}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 text-center font-medium">
            🔒 Paiement sécurisé. Vos données ne sont pas stockées sur nos serveurs.
          </p>
        </div>
      </div>
    </div>
  );
}