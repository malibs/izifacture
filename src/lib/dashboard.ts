import { effectiveStatus, invoiceTotal, outstandingAmount } from "@/lib/invoice-math";
import type { Invoice, InvoiceStatus } from "@/types";

export interface DashboardStats {
  invoiceCount: number;
  totalInvoiced: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  paidRatio: number;
  countByStatus: Record<InvoiceStatus, number>;
}

/** Les brouillons ne comptent pas comme chiffre d'affaires facturé. */
const isIssued = (invoice: Invoice) => effectiveStatus(invoice) !== "draft";

export function getDashboardStats(source: Invoice[]): DashboardStats {
  const issued = source.filter(isIssued);

  const totalInvoiced = issued.reduce((sum, inv) => sum + invoiceTotal(inv), 0);
  const totalPaid = issued.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalOverdue = issued
    .filter((inv) => effectiveStatus(inv) === "overdue")
    .reduce((sum, inv) => sum + outstandingAmount(inv), 0);
  const totalPending = totalInvoiced - totalPaid;

  const countByStatus: Record<InvoiceStatus, number> = {
    draft: 0,
    sent: 0,
    paid: 0,
    overdue: 0,
  };
  for (const invoice of source) {
    countByStatus[effectiveStatus(invoice)] += 1;
  }

  return {
    invoiceCount: source.length,
    totalInvoiced,
    totalPaid,
    totalPending,
    totalOverdue,
    paidRatio: totalInvoiced === 0 ? 0 : totalPaid / totalInvoiced,
    countByStatus,
  };
}

const MONTH_LABELS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

export interface MonthlyPoint {
  month: string;
  invoiced: number;
  paid: number;
}

/** Agrège le facturé et l'encaissé sur les `months` derniers mois. */
export function getMonthlySeries(
  source: Invoice[],
  months = 6,
): MonthlyPoint[] {
  const buckets = new Map<string, MonthlyPoint>();
  const keys: string[] = [];

  const latest = source
    .map((invoice) => invoice.issueDate)
    .sort()
    .at(-1);
  const reference = latest ? new Date(`${latest}T00:00:00Z`) : new Date();

  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const date = new Date(
      Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() - offset, 1),
    );
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    keys.push(key);
    buckets.set(key, {
      month: MONTH_LABELS[date.getUTCMonth()],
      invoiced: 0,
      paid: 0,
    });
  }

  for (const invoice of source) {
    if (!isIssued(invoice)) continue;
    const date = new Date(`${invoice.issueDate}T00:00:00Z`);
    const bucket = buckets.get(`${date.getUTCFullYear()}-${date.getUTCMonth()}`);
    if (!bucket) continue;
    bucket.invoiced += invoiceTotal(invoice);
    bucket.paid += invoice.amountPaid;
  }

  return keys.map((key) => buckets.get(key)!);
}

/** Les factures les plus récentes, du plus récent au plus ancien. */
export function getRecentInvoices(source: Invoice[], limit = 7) {
  return [...source]
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate))
    .slice(0, limit);
}
