"use client";

import React, { useState } from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/context/StoreContext';
import { Search, Filter, Download, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InvoiceStatus } from '@/lib/types';

export default function InvoicesPage() {
  const { invoices, updateInvoiceStatus } = useStore();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount).replace('XOF', 'FCFA');
  };

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const totalOutstanding = invoices.filter(i => i.status !== 'paid').reduce((sum, inv) => sum + inv.total, 0);

  const statusOptions: { label: string; value: InvoiceStatus; icon: React.ReactNode }[] = [
    { label: 'Brouillon', value: 'draft', icon: null },
    { label: 'Envoyée', value: 'sent', icon: null },
    { label: 'Payée', value: 'paid', icon: null },
    { label: 'En retard', value: 'overdue', icon: null },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Factures</h1>
          <p className="text-sm text-slate-500">Suivi précis de vos émissions et recouvrements.</p>
        </div>
        <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95 shrink-0">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exporter la liste</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Facturé"
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
          title="Montant Payé"
          value={formatCurrency(totalPaid)}
          variant="green"
          description={`${totalInvoiced ? ((totalPaid / totalInvoiced) * 100).toFixed(1) : '0'}% de recouvrement`}
        />
      </div>

      <div className="premium-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3 flex-1 w-full">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher une facture..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm shrink-0">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500 shrink-0">
            <span className="font-medium hidden sm:inline">Trier par :</span>
            <select className="bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer">
              <option>Date la plus récente</option>
              <option>Montant le plus élevé</option>
              <option>Statut</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">Référence</th>
                <th className="px-6 py-4 font-bold">Client</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Échéance</th>
                <th className="px-6 py-4 font-bold text-right">Montant</th>
                <th className="px-6 py-4 font-bold text-center">Statut</th>
                <th className="px-6 py-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{invoice.invoice_number}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{invoice.client_name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{invoice.date_issue}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{invoice.date_due}</td>
                  <td className="px-6 py-4 text-sm font-black text-right text-slate-900">
                    {formatCurrency(invoice.total)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-6 py-4 text-center relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === invoice.id ? null : invoice.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === invoice.id && (
                      <div className="absolute right-6 top-12 z-20 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl p-1 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Changer le statut
                        </div>
                        <div className="space-y-1">
                          {statusOptions.map(opt => (
                            <button
                              key={opt.value}
                              onClick={async () => {
                                try {
                                  await updateInvoiceStatus(invoice.id, opt.value);
                                  setActiveMenuId(null);
                                } catch (err: any) {
                                  alert(`Erreur: ${err.message}`);
                                }
                              }}
                              className={cn(
                                "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-xl transition-all",
                                invoice.status === opt.value
                                  ? "bg-brand-50 text-brand-600 font-bold"
                                  : "text-slate-600 hover:bg-slate-50"
                              )}
                            >
                              {opt.icon}
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
