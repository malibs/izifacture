"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'default' | 'indigo' | 'green';
}

export function StatCard({ title, value, description, trend, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: "bg-white border-slate-200 text-slate-900",
    indigo: "bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-500/20",
    green: "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20",
  };

  const labelStyles = {
    default: "text-slate-500",
    indigo: "text-brand-100",
    green: "text-emerald-100",
  };

  return (
    <div className={cn(
      "p-6 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group",
      variantStyles[variant]
    )}>
      <div className="flex items-center justify-between mb-3">
        <p className={cn("text-sm font-semibold tracking-tight", labelStyles[variant])}>
          {title}
        </p>
        {trend && (
          <span className={cn(
            "text-xs font-bold px-2 py-1 rounded-full",
            variant === 'default'
              ? (trend.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")
              : "bg-white/20 text-white"
          )}>
            {trend.value}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
      </div>

      {description && (
        <p className={cn("text-xs mt-3 font-medium", variant === 'default' ? labelStyles.default : labelStyles[variant])}>
          {description}
        </p>
      )}
    </div>
  );
}
