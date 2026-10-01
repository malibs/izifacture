"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Upload, Save, Building2, CheckCircle, AlertCircle, CreditCard, Crown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';
import { profileService } from '@/lib/services/profileService';
import { PLAN_LIMITS, PLAN_PRICES, PLAN_LABELS } from '@/lib/plans';
import { SubscriptionPlan } from '@/lib/types';
import { PaymentModal } from '@/components/payment/PaymentModal';

export default function SettingsPage() {
  const { profile, updateProfileData, refreshProfile, isLoading } = useStore();
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; plan: 'pro' | 'business' }>({
    isOpen: false,
    plan: 'pro',
  });

  const [formData, setFormData] = useState({
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    ninea_rccm: '',
    vat_rate: 18,
    currency: 'XOF',
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger les données du profil dans le formulaire
  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || '',
        company_email: profile.company_email || '',
        company_phone: profile.company_phone || '',
        company_address: profile.company_address || '',
        ninea_rccm: profile.ninea_rccm || '',
        vat_rate: profile.vat_rate || 18,
        currency: profile.currency || 'XOF',
      });
      setLogoUrl(profile.company_logo_url);
    }
  }, [profile]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfileData({
        ...formData,
        company_logo_url: logoUrl,
      });
      showToast('success', 'Paramètres enregistrés avec succès !');
    } catch (err: any) {
      showToast('error', `Erreur: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation : type et taille (max 2MB)
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Veuillez sélectionner une image valide.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('error', 'L\'image ne doit pas dépasser 2 Mo.');
      return;
    }

    setIsUploading(true);
    try {
      const publicUrl = await profileService.uploadLogo(file);
      setLogoUrl(publicUrl);
      // Sauvegarder immédiatement l'URL du logo
      await updateProfileData({ company_logo_url: publicUrl });
      showToast('success', 'Logo mis à jour !');
    } catch (err: any) {
      showToast('error', `Erreur upload: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const currentPlan = profile?.subscription_plan || 'free';
  const planConfig = PLAN_LIMITS[currentPlan];

  if (isLoading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400 text-sm font-medium">Chargement des paramètres…</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300",
          toast.type === 'success' ? "bg-green-50 text-green-700 border border-green-200" :
          toast.type === 'info' ? "bg-slate-50 text-slate-700 border border-slate-200" :
          "bg-red-50 text-red-700 border border-red-200"
        )}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Paramètres</h1>
          <p className="text-sm text-slate-500 font-medium">Configurez votre entreprise et vos préférences de facturation.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-500/20 active:scale-95 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">{isSaving ? 'Enregistrement…' : 'Enregistrer'}</span>
          <span className="sm:hidden">{isSaving ? '…' : 'OK'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Logo & Identity */}
        <div className="lg:col-span-1 space-y-6">
          <div className="premium-card p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-600" />
              Identité Visuelle
            </h2>

            <div className="flex flex-col items-center gap-4">
              <div
                className="relative w-32 h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group cursor-pointer hover:border-brand-400 transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-brand-500 transition-colors" />
                    <p className="text-xs text-slate-500 font-medium">Cliquez pour uploader</p>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>
              <p className="text-xs text-slate-400 font-medium text-center">PNG ou JPG, max 2 Mo</p>
              {logoUrl && (
                <button
                  onClick={() => {
                    setLogoUrl(null);
                    updateProfileData({ company_logo_url: null });
                  }}
                  className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                  Supprimer le logo
                </button>
              )}
            </div>
          </div>

          {/* Section Abonnement */}
          <div className="premium-card p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Crown className="w-5 h-5 text-brand-600" />
              Abonnement
            </h2>

            <div className={cn(
              "rounded-2xl p-4 border-2",
              currentPlan === 'free' ? "bg-slate-50 border-slate-200" :
              currentPlan === 'pro' ? "bg-brand-50 border-brand-200" :
              "bg-amber-50 border-amber-200"
            )}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">Plan {PLAN_LABELS[currentPlan]}</span>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full",
                  profile?.subscription_status === 'trial' ? "bg-amber-100 text-amber-700" :
                  profile?.subscription_status === 'active' ? "bg-green-100 text-green-700" :
                  "bg-red-100 text-red-700"
                )}>
                  {profile?.subscription_status === 'trial' ? 'Essai' :
                   profile?.subscription_status === 'active' ? 'Actif' : 'Expiré'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {planConfig.maxInvoicesPerMonth === Infinity
                  ? 'Factures illimitées'
                  : `${planConfig.maxInvoicesPerMonth} factures / mois`}
              </p>
              {profile?.trial_ends_at && (
                <p className="text-xs text-slate-400 mt-1">
                  Essai jusqu'au {new Date(profile.trial_ends_at).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>

            {/* Upgrade options */}
            <div className="space-y-2">
              {(Object.keys(PLAN_LIMITS) as SubscriptionPlan[]).map(plan => {
                if (plan === currentPlan) return null;
                const isUpgrade = plan !== 'free';
                return (
                  <div
                    key={plan}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-brand-300 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      {plan === 'business' ? <Sparkles className="w-4 h-4 text-amber-500" /> : <CreditCard className="w-4 h-4 text-brand-500" />}
                      <div>
                        <p className="text-sm font-bold text-slate-900">Plan {PLAN_LABELS[plan]}</p>
                        <p className="text-xs text-slate-400">
                          {PLAN_PRICES[plan].monthly === 0 ? 'Gratuit' : `${PLAN_PRICES[plan].monthly.toLocaleString('fr-FR')} FCFA/mois`}
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-50"
                      onClick={() => {
                        if (isUpgrade) {
                          setPaymentModal({ isOpen: true, plan });
                        } else {
                          showToast('info', 'Vous êtes déjà sur le plan gratuit.');
                        }
                      }}
                    >
                      {isUpgrade ? 'Passer à' : 'Revenir à'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="premium-card p-5 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Informations de l'Entreprise</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nom de l'entreprise</label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email de contact</label>
                <input
                  type="email"
                  value={formData.company_email}
                  onChange={e => setFormData({ ...formData, company_email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Téléphone</label>
                <input
                  type="text"
                  value={formData.company_phone}
                  onChange={e => setFormData({ ...formData, company_phone: e.target.value })}
                  placeholder="+221 ..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">NINEA / RCCM</label>
                <input
                  type="text"
                  value={formData.ninea_rccm}
                  onChange={e => setFormData({ ...formData, ninea_rccm: e.target.value })}
                  placeholder="SN-123456789"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Adresse physique</label>
                <input
                  type="text"
                  value={formData.company_address}
                  onChange={e => setFormData({ ...formData, company_address: e.target.value })}
                  placeholder="Dakar, Plateau, Rue 12"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="premium-card p-5 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Configuration Fiscale</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Taux de TVA (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.vat_rate}
                    onChange={e => setFormData({ ...formData, vat_rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all pr-10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Devise par défaut</label>
                <select
                  value={formData.currency}
                  onChange={e => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer"
                >
                  <option value="XOF">FCFA (XOF)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="USD">Dollar (USD)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de paiement */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ ...paymentModal, isOpen: false })}
        plan={paymentModal.plan}
      />
    </div>
  );
}