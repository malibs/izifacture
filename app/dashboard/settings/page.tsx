"use client";

import React, { useState } from 'react';
import { Upload, Save, Building2, MapPin, Globe, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-sm text-gray-500">Configurez les détails de votre entreprise et vos préférences de facturation</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm shadow-indigo-200">
          <Save className="w-4 h-4" />
          Enregistrer les modifications
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Company Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              Identité Visuelle
            </h2>

            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group">
                <div className="text-center p-4">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-indigo-500 transition-colors" />
                  <p className="text-xs text-gray-500 font-medium">Logo Entreprise</p>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={() => setIsUploading(true)}
                />
              </div>
              <button
                onClick={() => setIsUploading(false)}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Modifier le logo
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de l'Entreprise</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                <input
                  type="text"
                  defaultValue="IziFacture SAS"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email de contact</label>
                <input
                  type="email"
                  defaultValue="contact@izifacture.sn"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  Adresse physique
                </label>
                <input
                  type="text"
                  defaultValue="Dakar, Plateau, Rue 12"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-gray-400" />
                  Site Web
                </label>
                <input
                  type="text"
                  placeholder="www.entreprise.com"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                  Numéro RCCM / NINEA
                </label>
                <input
                  type="text"
                  placeholder="SN-123456789"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration Fiscale</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Taux de TVA (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    defaultValue="18"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Devise par défaut</label>
                <select
                  defaultValue="XOF"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
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
    </div>
  );
}
