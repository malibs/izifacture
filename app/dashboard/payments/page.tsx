"use client";

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { CreditCard, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { InvoiceStatus } from '@/lib/types';

export default function PaymentsPage() {
  const { invoices, updateInvoiceStatus } = useStore();
  const [filter, setFilter] = useState<'all' | 'paid' | 'sent' | 'overdue'>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount).replace('XOF', 'F CFA');
  };

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const totalPending = invoices.filter(i => i.status === 'sent').reduce((sum, inv) => sum + inv.total, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);

  const filteredInvoices = filter === 'all'
    ? invoices.filter(i => i.status !== 'draft')
    : invoices.filter(i => i.status === filter);

  const statusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
    draft: { label: 'Brouillon', className: 'bg-slate-100 text-slate-600' },
    sent: { label: 'Envoyée', className: 'bg-blue-50 text-blue-600' },
    paid: { label: 'Payée', className: 'bg-green-50 text-green-600' },
    overdue: { label: 'En retard', className: 'bg-red-50 text-red-600' },
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await updateInvoiceStatus(id, 'paid');
    } catch (err: any) {
      alert(`Erreur: ${err.message}`);
    }
  };

  const statCards = [
    { label: 'Total Encaissé', value: totalPaid, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Paiements en Attente', value: totalPending, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Paiements en Retard', value: totalOverdue, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Paiements</h1>
          <p className="text-sm text-slate-500 font-medium">Suivez vos encaissements et relancez les retards.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="premium-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                  <Icon className={cn('w-5 h-5', stat.color)} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(stat.value)}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { key: 'all', label: 'Toutes' },
          { key: 'sent', label: 'En attente' },
          { key: 'paid', label: 'Payées' },
          { key: 'overdue', label: 'En retard' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-bold transition-all',
              filter === f.key
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Facture</th>
                <th className="px-6 py-4 font-bold">Client</th>
                <th className="px-6 py-4 font-bold">Montant</th>
                <th className="px-6 py-4 font-bold">Statut</th>
                <th className="px-6 py-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <CreditCard className="w-10 h-10 opacity-40" />
                      <p className="text-sm font-medium">Aucun paiement à afficher dans cette catégorie.</p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{inv.invoice_number}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-medium">{inv.client_name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(inv.total)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full',
                      statusConfig[inv.status].className
                    )}>
                      {statusConfig[inv.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {inv.status !== 'paid' && (
                      <button
                        onClick={() => handleMarkPaid(inv.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-all active:scale-95"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Marquer payée
                      </button>
                    )}
                    {inv.status === 'paid' && (
                      <span className="text-xs text-slate-400 font-medium italic">Encaissé</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Link
        href="/dashboard/invoices"
        className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
      >
        Voir toutes les factures
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}