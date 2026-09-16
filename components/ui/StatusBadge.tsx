"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export function StatusBadge({ status }: { status: string }) {
  const styles = {
    paid: "bg-green-100 text-green-700 border-green-200",
    sent: "bg-blue-100 text-blue-700 border-blue-200",
    overdue: "bg-red-100 text-red-700 border-red-200",
    draft: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const labels = {
    paid: "Payée",
    sent: "Envoyée",
    overdue: "En retard",
    draft: "Brouillon",
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-medium border",
      styles[status as keyof typeof styles] || styles.draft
    )}>
      {labels[status as keyof typeof labels] || status}
    </span>
  );
}
