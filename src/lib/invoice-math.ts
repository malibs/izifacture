import type { Invoice, InvoiceItem, InvoiceStatus, InvoiceTotals } from "@/types";

/**
 * Source de vérité unique pour tout calcul monétaire.
 * Les montants sont des entiers de FCFA ; l'arrondi n'intervient qu'une seule
 * fois, sur le total de TVA, jamais ligne par ligne.
 */

export function lineTotal(item: InvoiceItem) {
  return Math.round(item.quantity * item.unitPrice);
}

export function computeTotals(
  items: InvoiceItem[],
  vatRate: number,
): InvoiceTotals {
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const vatBase = items
    .filter((item) => item.vatApplicable)
    .reduce((sum, item) => sum + lineTotal(item), 0);
  const vat = Math.round((vatBase * vatRate) / 100);

  return { subtotal, vat, total: subtotal + vat };
}

export function invoiceTotal(invoice: Invoice) {
  return computeTotals(invoice.items, invoice.vatRate).total;
}

/**
 * Le statut « en retard » est dérivé, jamais stocké : une facture envoyée dont
 * l'échéance est dépassée est en retard.
 */
export function effectiveStatus(invoice: Invoice, today = new Date()): InvoiceStatus {
  if (invoice.status === "paid" || invoice.status === "draft") {
    return invoice.status;
  }
  const due = new Date(`${invoice.dueDate}T00:00:00Z`);
  const reference = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
  return due.getTime() < reference ? "overdue" : "sent";
}

export function outstandingAmount(invoice: Invoice) {
  return Math.max(invoiceTotal(invoice) - invoice.amountPaid, 0);
}
