"use client";

import React from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Save, ArrowLeft, FileText, Calendar, User, Hash } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { InvoiceSchema, type InvoiceFormValues } from '@/lib/validations/invoice';
import { cn } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';
import { Invoice } from '@/lib/types';

export default function NewInvoicePage() {
  const router = useRouter();
  const { customers, addInvoice } = useStore();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: {
      items: [{ description: '', quantity: 1, price: 0 }],
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');

  // Calculations
  const subtotal = watchedItems?.reduce((sum, item) => {
    return sum + (Number(item.quantity || 0) * Number(item.price || 0));
  }, 0) || 0;
  const vat = subtotal * 0.18;
  const total = subtotal + vat;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount).replace('XOF', 'FCFA');
  };

  const onSubmit: SubmitHandler<InvoiceFormValues> = async (data) => {
    try {
      const selectedCustomer = customers.find(c => c.id === data.client_id);

      const invoiceData: Omit<Invoice, 'id' | 'client_name'> = {
        client_id: data.client_id,
        invoice_number: data.invoice_number,
        date_issue: data.date_issue,
        date_due: data.date_due,
        status: 'draft',
        subtotal,
        vat,
        total,
        notes: data.notes,
        items: data.items,
      };

      await addInvoice(invoiceData, data.items);
      router.push('/dashboard/invoices');
    } catch (err: any) {
      alert(`Erreur lors de l'enregistrement: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/invoices"
            className="p-2.5 hover:bg-slate-200/50 rounded-full transition-all text-slate-400 hover:text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nouvelle Facture</h1>
            <p className="text-sm text-slate-500 font-medium">Émettez un document professionnel en quelques clics.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/invoices"
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            Annuler
          </Link>
          <button
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-500/20 active:scale-95"
          >
            <Save className="w-4 h-4" />
            Enregistrer la facture
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Document Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="premium-card p-8 space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Informations Générales</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-3 h-3" /> Client
                </label>
                <select
                  {...register('client_id')}
                  className={cn(
                    "w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all",
                    errors.client_id ? "border-red-500" : "border-slate-200"
                  )}
                >
                  <option value="">Sélectionnez un client</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
                {errors.client_id && <p className="text-xs text-red-500 font-medium">{errors.client_id.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Hash className="w-3 h-3" /> Numéro de facture
                </label>
                <input
                  {...register('invoice_number')}
                  placeholder="INV-2026-001"
                  className={cn(
                    "w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all",
                    errors.invoice_number ? "border-red-500" : "border-slate-200"
                  )}
                />
                {errors.invoice_number && <p className="text-xs text-red-500 font-medium">{errors.invoice_number.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Date d'émission
                </label>
                <input
                  type="date"
                  {...register('date_issue')}
                  className={cn(
                    "w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all",
                    errors.date_issue ? "border-red-500" : "border-slate-200"
                  )}
                />
                {errors.date_issue && <p className="text-xs text-red-500 font-medium">{errors.date_issue.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Date d'échéance
                </label>
                <input
                  type="date"
                  {...register('date_due')}
                  className={cn(
                    "w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all",
                    errors.date_due ? "border-red-500" : "border-slate-200"
                  )}
                />
                {errors.date_due && <p className="text-xs text-red-500 font-medium">{errors.date_due.message}</p>}
              </div>
            </div>
          </div>

          <div className="premium-card p-8 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Articles</h2>
              </div>
              <button
                type="button"
                onClick={() => append({ description: '', quantity: 1, price: 0 })}
                className="flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Ajouter un article
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="col-span-6">Description du service</div>
                <div className="col-span-2 text-center">Qté</div>
                <div className="col-span-3 text-right">Prix Unit.</div>
                <div className="col-span-1"></div>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-4 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:border-brand-200 hover:bg-white hover:shadow-sm animate-in slide-in-from-left-2 duration-300">
                  <div className="col-span-6 space-y-1">
                    <input
                      {...register(`items.${index}.description`)}
                      placeholder="Ex: Développement Web"
                      className={cn(
                        "w-full px-4 py-2 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all",
                        errors.items?.[index]?.description ? "border-red-500" : "border-slate-200"
                      )}
                    />
                    {errors.items?.[index]?.description && <p className="text-[10px] text-red-500 font-medium">{errors.items[index]?.description?.message}</p>}
                  </div>

                  <div className="col-span-2 space-y-1">
                    <input
                      type="number"
                      {...register(`items.${index}.quantity`)}
                      className={cn(
                        "w-full px-3 py-2 bg-white border rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all",
                        errors.items?.[index]?.quantity ? "border-red-500" : "border-slate-200"
                      )}
                    />
                    {errors.items?.[index]?.quantity && <p className="text-[10px] text-red-500 text-center font-medium">{errors.items[index]?.quantity?.message}</p>}
                  </div>

                  <div className="col-span-3 space-y-1">
                    <input
                      type="number"
                      {...register(`items.${index}.price`)}
                      className={cn(
                        "w-//full px-4 py-2 bg-white border rounded-xl text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all",
                        errors.items?.[index]?.price ? "border-red-500" : "border-slate-200"
                      )}
                    />
                    {errors.items?.[index]?.price && <p className="text-[10px] text-red-500 text-right font-medium">{errors.items[index]?.price?.message}</p>}
                  </div>

                  <div className="col-span-1 flex justify-center items-start pt-2">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="p-2 text-slate-300 hover:text-red-500 transition-all rounded-lg hover:bg-red-50 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Area */}
        <div className="lg:col-span-4 space-y-6">
          <div className="premium-card p-8 space-y-8 sticky top-24">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Résumé</h2>
              <div className="h-1 w-12 bg-brand-500 rounded-full"></div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Sous-total</span>
                <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">TVA (18%)</span>
                <span className="font-bold text-slate-900">{formatCurrency(vat)}</span>
              </div>
              <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="text-base font-black text-slate-900 uppercase tracking-wider">Total TTC</span>
                <span className="text-3xl font-black text-brand-600 tracking-tighter">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notes additionnelles</label>
              <textarea
                {...register('notes')}
                rows={4}
                placeholder="Ajoutez un message personnalisé pour votre client..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
