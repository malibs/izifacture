"use client";

import React from 'react';
import Link from 'next/link';
import { Search, Bell, Plus, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-10">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        {/* Mobile sidebar toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search — hidden on very small screens */}
        <div className="relative w-full max-w-md group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
          <input
            type="text"
            placeholder="Rechercher un client, une facture..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button className="p-2 text-slate-400 hover:text-slate-600 relative transition-all hover:bg-slate-100 rounded-lg">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <Link
          href="/dashboard/invoices/new"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-brand-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nouvelle Facture</span>
          <span className="sm:hidden">Facture</span>
        </Link>
      </div>
    </header>
  );
}