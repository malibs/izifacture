import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { getClient } from "@/lib/data/clients";
import { formatDate, formatFCFA } from "@/lib/format";
import { effectiveStatus, invoiceTotal } from "@/lib/invoice-math";
import type { Invoice } from "@/types";

function Row({ invoice }: { invoice: Invoice }) {
  const client = getClient(invoice.clientId);
  const status = effectiveStatus(invoice);

  return (
    <tr className="group border-t border-line transition-colors hover:bg-surface-muted">
      <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium">
        <Link href={`/invoices/${invoice.id}`} className="hover:text-brand-600">
          {invoice.number}
        </Link>
      </td>
      <td className="px-5 py-3.5 text-sm">
        <div className="flex items-center gap-2.5">
          <Avatar
            name={client?.companyName ?? "?"}
            color={client?.accentColor}
            className="h-7 w-7 text-[10px]"
          />
          <div className="min-w-0">
            <p className="truncate font-medium">{client?.companyName}</p>
            <p className="truncate text-xs text-ink-faint">{client?.name}</p>
          </div>
        </div>
      </td>
      <td className="hidden max-w-[220px] px-5 py-3.5 text-sm text-ink-soft xl:table-cell">
        <span className="block truncate">{invoice.projectName}</span>
      </td>
      <td className="whitespace-nowrap px-5 py-3.5 text-right text-sm font-medium tabular">
        {formatFCFA(invoiceTotal(invoice))}
      </td>
      <td className="hidden whitespace-nowrap px-5 py-3.5 text-sm text-ink-soft tabular md:table-cell">
        {formatDate(invoice.dueDate)}
      </td>
      <td className="whitespace-nowrap px-5 py-3.5">
        <StatusBadge status={status} />
      </td>
      <td className="hidden whitespace-nowrap px-5 py-3.5 text-sm text-ink-soft lg:table-cell">
        {invoice.owner}
      </td>
      <td className="px-3 py-3.5 text-right">
        <button
          type="button"
          className="rounded-lg p-1.5 text-ink-faint opacity-0 transition-opacity hover:bg-surface-sunken group-hover:opacity-100 focus:opacity-100"
          aria-label={`Actions pour la facture ${invoice.number}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

function MobileCard({ invoice }: { invoice: Invoice }) {
  const client = getClient(invoice.clientId);

  return (
    <Link
      href={`/invoices/${invoice.id}`}
      className="flex items-center gap-3 border-t border-line px-4 py-3.5 active:bg-surface-muted"
    >
      <Avatar
        name={client?.companyName ?? "?"}
        color={client?.accentColor}
        className="h-9 w-9 text-[11px]"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{client?.companyName}</p>
        <p className="truncate text-xs text-ink-faint">
          {invoice.number} · échéance {formatDate(invoice.dueDate)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="text-sm font-semibold tabular">
          {formatFCFA(invoiceTotal(invoice))}
        </span>
        <StatusBadge status={effectiveStatus(invoice)} />
      </div>
    </Link>
  );
}

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <>
      <div className="sm:hidden">
        {invoices.map((invoice) => (
          <MobileCard key={invoice.id} invoice={invoice} />
        ))}
      </div>

      <table className="hidden w-full border-collapse text-left sm:table">
        <thead>
          <tr className="bg-surface-muted text-xs font-medium uppercase tracking-wide text-ink-faint">
            <th scope="col" className="px-5 py-3 font-medium">
              Facture
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Client
            </th>
            <th scope="col" className="hidden px-5 py-3 font-medium xl:table-cell">
              Projet
            </th>
            <th scope="col" className="px-5 py-3 text-right font-medium">
              Montant
            </th>
            <th scope="col" className="hidden px-5 py-3 font-medium md:table-cell">
              Échéance
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Statut
            </th>
            <th scope="col" className="hidden px-5 py-3 font-medium lg:table-cell">
              Responsable
            </th>
            <th scope="col" className="px-3 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <Row key={invoice.id} invoice={invoice} />
          ))}
        </tbody>
      </table>
    </>
  );
}
