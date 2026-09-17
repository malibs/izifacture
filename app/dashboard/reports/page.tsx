"use client";

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { TrendingUp, PieChart, Users, FileText, CheckCircle, Clock, AlertCircle, FileEdit } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReportsPage() {
  const { invoices, customers } = useStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount).replace('XOF', 'F CFA');
  };

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const totalOutstanding = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);
  const collectionRate = totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0;

  // Status distribution
  const statusBreakdown = [
    { label: 'Payées', value: invoices.filter(i => i.status === 'paid').length, color: 'bg-green-500', icon: CheckCircle },
    { label: 'Envoyées', value: invoices.filter(i => i.status === 'sent').length, color: 'bg-blue-500', icon: Clock },
    { label: 'En retard', value: invoices.filter(i => i.status === 'overdue').length, color: 'bg-red-500', icon: AlertCircle },
    { label: 'Brouillons', value: invoices.filter(i => i.status === 'draft').length, color: 'bg-slate-400', icon: FileEdit },
  ];
  const totalInvoices = invoices.length || 1;

  // Top customers by revenue
  const customerRevenue = customers.map(customer => {
    const customerInvoices = invoices.filter(inv => inv.client_id === customer.id);
    const revenue = customerInvoices.reduce((sum, inv) => sum + inv.total, 0);
    return { name: customer.name, revenue, count: customerInvoices.length };
  }).filter(c => c.revenue > 0).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Monthly breakdown
  const monthlyData = invoices.reduce((acc, inv) => {
    const month = inv.date_issue.substring(0, 7); // YYYY-MM
    if (!acc[month]) acc[month] = { total: 0, count: 0, paid: 0 };
    acc[month].total += inv.total;
    acc[month].count += 1;
    if (inv.status === 'paid') acc[month].paid += inv.total;
    return acc;
  }, {} as Record<string, { total: number; count: number; paid: number }>);
  const months = Object.entries(monthlyData)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 6)
    .reverse() as [string, { total: number; count: number; paid: number }][];

  const kpis = [
    { label: "Chiffre d'Affaires Total", value: formatCurrency(totalInvoiced), icon: TrendingUp, accent: 'text-brand-600' },
    { label: 'Total Encaissé', value: formatCurrency(totalPaid), icon: CheckCircle, accent: 'text-green-600' },
    { label: 'Encours Restant', value: formatCurrency(totalOutstanding), icon: Clock, accent: 'text-blue-600' },
    { label: 'Taux de Recouvrement', value: `${collectionRate.toFixed(1)}%`, icon: PieChart, accent: 'text-indigo-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Rapports</h1>
        <p className="text-sm text-slate-500 font-medium">Analysez la performance de votre activité.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="premium-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                <Icon className={cn('w-5 h-5', kpi.accent)} />
              </div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Invoice Status Distribution */}
        <div className="premium-card p-8 space-y-6">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <PieChart className="w-5 h-5 text-brand-500" />
            Répartition des Factures
          </h3>

          {/* Progress bar */}
          <div className="flex h-3 rounded-full overflow-hidden bg-slate-100">
            {statusBreakdown.map((s) => s.value > 0 && (
              <div
                key={s.label}
                className={s.color}
                style={{ width: `${(s.value / totalInvoices) * 100}%` }}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {statusBreakdown.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-2.5 h-2.5 rounded-full', s.color)} />
                    <span className="text-sm font-medium text-slate-600">{s.label}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{s.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Customers */}
        <div className="premium-card p-8 space-y-6">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-500" />
            Meilleurs Clients
          </h3>
          {customerRevenue.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Pas encore de données client.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {customerRevenue.map((c, idx) => (
                <div key={c.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-400">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="text-sm font-bold text-slate-900">{c.name}</span>
                    </div>
                    <span className="text-sm font-bold text-brand-600">{formatCurrency(c.revenue)}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-500"
                      style={{ width: `${(c.revenue / customerRevenue[0].revenue) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{c.count} facture{c.count > 1 ? 's' : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Monthly Activity */}
      <div className="premium-card p-8 space-y-6">
        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-500" />
          Activité Mensuelle
        </h3>
        {months.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm font-medium">Aucune facture émise pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Mois</th>
                  <th className="px-4 py-3 text-center">Nb. Factures</th>
                  <th className="px-4 py-3 text-right">Total Facturé</th>
                  <th className="px-4 py-3 text-right">Encaissé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {months.map(([month, data]) => (
                  <tr key={month} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-slate-900">
                      {new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-slate-600 font-medium">{data.count}</td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-900 text-right">{formatCurrency(data.total)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-green-600 text-right">{formatCurrency(data.paid)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}