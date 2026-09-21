"use client";

import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { TrendingUp, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function DashboardPage() {
  const { invoices } = useStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount).replace('XOF', 'FCFA');
  };

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const totalOutstanding = invoices.filter(i => i.status !== 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Tableau de Bord</h1>
          <p className="text-sm text-slate-500">Bienvenue sur IziFacture. Voici l'état de vos finances.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenus Totaux"
          value={formatCurrency(totalInvoiced)}
          variant="indigo"
          description="Volume d'affaires global"
        />
        <StatCard
          title="En Attente"
          value={formatCurrency(totalOutstanding)}
          description={`${totalInvoiced ? ((totalOutstanding / totalInvoiced) * 100).toFixed(1) : '0'}% du total`}
        />
        <StatCard
          title="Payé"
          value={formatCurrency(totalPaid)}
          variant="green"
          description={`${totalInvoiced ? ((totalPaid / totalInvoiced) * 100).toFixed(1) : '0'}% de recouvrement`}
        />
        <StatCard
          title="En Retard"
          value={formatCurrency(totalOverdue)}
          description="Montant critique à recouvrer"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 premium-card p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-brand-500" />
              Flux de Trésorerie
            </h3>
            <select className="text-sm border-none bg-slate-50 font-semibold text-slate-600 rounded-lg px-3 py-1 focus:ring-0 cursor-pointer">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
            </select>
          </div>
          <div className="h-64 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 italic">
            Graphique de revenus (implémenté en phase 2)
          </div>
        </div>

        <div className="premium-card p-8 space-y-6">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Alertes Urgentes
          </h3>
          <div className="space-y-4">
            {invoices
              .filter(inv => inv.status === 'overdue')
              .slice(0, 5)
              .map((inv) => (
                <div key={inv.id} className="p-4 bg-red-50/50 rounded-2xl border border-red-100 transition-all hover:bg-red-50 group">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-red-900 group-hover:text-red-700">{inv.client_name}</p>
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                      Retard
                    </span>
                  </div>
                  <p className="text-xs text-red-700 mt-1 font-medium">Montant: {formatCurrency(inv.total)}</p>
                </div>
              ))}
            {invoices.filter(inv => inv.status === 'overdue').length === 0 && (
              <div className="text-center py-8 space-y-2">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-500">Aucune facture en retard !</p>
              </div>
            )}
          </div>
          <Link
            href="/dashboard/invoices"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            Voir toutes les factures
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
