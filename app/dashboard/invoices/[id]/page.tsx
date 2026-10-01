"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Download, Send, CheckCircle, Mail, MessageCircle,
  FileText, Loader2, Printer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';
import { invoiceService } from '@/lib/services/invoiceService';
import { Invoice, InvoiceStatus } from '@/lib/types';
import { pdf } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/invoice/InvoicePDF';

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: { label: 'Brouillon', className: 'bg-slate-100 text-slate-600' },
  sent: { label: 'Envoyée', className: 'bg-blue-50 text-blue-600' },
  paid: { label: 'Payée', className: 'bg-green-50 text-green-600' },
  overdue: { label: 'En retard', className: 'bg-red-50 text-red-600' },
};

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { profile, updateInvoiceStatus, invoices } = useStore();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [customer, setCustomer] = useState<{ name: string; email: string; phone: string; address: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadInvoice = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const inv = await invoiceService.getById(id);
      setInvoice(inv);
      // @ts-expect-error — customer est attaché par getById
      setCustomer(inv.customer || null);
    } catch (err: any) {
      // Fallback : chercher dans le state local
      const localInv = invoices.find(i => i.id === id);
      if (localInv) {
        setInvoice(localInv);
      } else {
        console.error('Erreur chargement facture:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [id, invoices]);

  useEffect(() => {
    loadInvoice();
  }, [loadInvoice]);

  const currency = profile?.currency || 'XOF';
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
    }).format(amount).replace(currency, currency === 'XOF' ? 'FCFA' : currency);
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return;
    setDownloading(true);
    try {
      const blob = await pdf(
        <InvoicePDF invoice={invoice} profile={profile} customer={customer} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Facture-${invoice.invoice_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Erreur génération PDF: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    if (!invoice) return;
    setUpdatingStatus(true);
    try {
      await updateInvoiceStatus(invoice.id, newStatus);
      setInvoice({ ...invoice, status: newStatus });
    } catch (err: any) {
      alert(`Erreur: ${err.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleWhatsAppSend = () => {
    if (!invoice || !customer?.phone) {
      alert('Numéro de téléphone du client manquant.');
      return;
    }
    const phone = customer.phone.replace(/[^0-9]/g, '');
    const message = `Bonjour ${invoice.client_name},\n\nVoici votre facture ${invoice.invoice_number} d'un montant de ${formatCurrency(invoice.total)}, échéance le ${new Date(invoice.date_due).toLocaleDateString('fr-FR')}.\n\nMerci de votre confiance.\n${profile?.company_name || ''}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center pt-20">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Facture introuvable</h2>
        <Link href="/dashboard/invoices" className="inline-flex items-center gap-2 text-brand-600 font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Retour aux factures
        </Link>
      </div>
    );
  }

  const vatRate = profile?.vat_rate ?? 18;
  const statusInfo = STATUS_CONFIG[invoice.status];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/invoices"
            className="p-2.5 hover:bg-slate-200/50 rounded-full transition-all text-slate-400 hover:text-slate-600 shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{invoice.invoice_number}</h1>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0",
                statusInfo.className
              )}>
                {statusInfo.label}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">{invoice.client_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-500/20 active:scale-95"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span className="hidden sm:inline">Télécharger PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimer</span>
          </button>
        </div>
      </div>

      {/* Actions de statut */}
      <div className="flex flex-wrap gap-2">
        {invoice.status !== 'sent' && invoice.status !== 'paid' && (
          <button
            onClick={() => handleStatusChange('sent')}
            disabled={updatingStatus}
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            Marquer comme envoyée
          </button>
        )}
        {invoice.status !== 'paid' && (
          <button
            onClick={() => handleStatusChange('paid')}
            disabled={updatingStatus}
            className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
          >
            <CheckCircle className="w-4 h-4" />
            Marquer comme payée
          </button>
        )}
        {customer?.phone && (
          <button
            onClick={handleWhatsAppSend}
            className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            Envoyer par WhatsApp
          </button>
        )}
      </div>

      {/* Aperçu de la facture */}
      <div className="premium-card p-6 sm:p-10 space-y-8">
        {/* En-tête facture */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {profile?.company_logo_url ? (
                <img src={profile.company_logo_url} alt="logo" className="w-12 h-12 rounded-xl object-cover" />
              ) : (
                <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-xl">
                    {(profile?.company_name || 'M').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold text-slate-900">{profile?.company_name || 'Mon Entreprise'}</h2>
                {profile?.company_email && <p className="text-xs text-slate-500">{profile.company_email}</p>}
                {profile?.company_phone && <p className="text-xs text-slate-500">{profile.company_phone}</p>}
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right space-y-1">
            <h3 className="text-3xl font-black text-brand-600 tracking-tight">FACTURE</h3>
            <p className="text-sm font-bold text-slate-900">{invoice.invoice_number}</p>
            <p className="text-xs text-slate-500">Émise le {new Date(invoice.date_issue).toLocaleDateString('fr-FR')}</p>
            <p className="text-xs text-slate-500">Échéance : {new Date(invoice.date_due).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>

        {/* Émetteur & Client */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">De</p>
            <p className="text-sm font-bold text-slate-900">{profile?.company_name || 'Mon Entreprise'}</p>
            {profile?.company_address && <p className="text-xs text-slate-500">{profile.company_address}</p>}
            {profile?.ninea_rccm && <p className="text-xs text-slate-500">NINEA/RCCM : {profile.ninea_rccm}</p>}
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Facturé à</p>
            <p className="text-sm font-bold text-slate-900">{invoice.client_name}</p>
            {customer?.address && <p className="text-xs text-slate-500">{customer.address}</p>}
            {customer?.email && <p className="text-xs text-slate-500">{customer.email}</p>}
            {customer?.phone && <p className="text-xs text-slate-500">{customer.phone}</p>}
          </div>
        </div>

        {/* Articles */}
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-4 py-3 rounded-l-xl">Description</th>
                <th className="px-4 py-3 text-center">Qté</th>
                <th className="px-4 py-3 text-right">Prix unit.</th>
                <th className="px-4 py-3 text-right rounded-r-xl">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-sm text-slate-700 font-medium">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-center text-slate-600">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-right text-slate-600">{formatCurrency(item.price)}</td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-slate-900">
                    {formatCurrency(item.quantity * item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totaux */}
        <div className="flex justify-end">
          <div className="w-full sm:w-72 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Sous-total HT</span>
              <span className="font-bold text-slate-900">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">TVA ({vatRate}%)</span>
              <span className="font-bold text-slate-900">{formatCurrency(invoice.vat)}</span>
            </div>
            <div className="flex justify-between items-center bg-brand-600 text-white px-4 py-3 rounded-2xl">
              <span className="font-bold uppercase tracking-wider text-sm">Total TTC</span>
              <span className="text-xl font-black tracking-tight">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notes</p>
            <p className="text-sm text-slate-600">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}