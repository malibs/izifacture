import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PrintTrigger } from "@/components/invoices/print-trigger";
import { getClient, getInvoice, getOrganization } from "@/lib/queries";
import { formatDate, formatFCFA } from "@/lib/format";
import {
  computeTotals,
  effectiveStatus,
  lineTotal,
  outstandingAmount,
} from "@/lib/invoice-math";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const invoice = await getInvoice(params.id);
  return {
    title: invoice ? `Facture ${invoice.number}` : "Facture",
    robots: { index: false, follow: false },
  };
}

const STATUS_LABEL: Record<string, string> = {
  draft: "Brouillon",
  sent: "Envoyée",
  paid: "Payée",
  overdue: "En retard",
};

export default async function InvoicePrintPage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = await getInvoice(params.id);
  if (!invoice) notFound();

  const [client, company] = await Promise.all([
    getClient(invoice.clientId),
    getOrganization(),
  ]);
  const totals = computeTotals(invoice.items, invoice.vatRate);
  const outstanding = outstandingAmount(invoice);
  const status = effectiveStatus(invoice);

  return (
    <div className="mx-auto max-w-3xl bg-white p-10 text-[13px] text-ink print:p-0">
      <PrintTrigger />

      <header className="flex items-start justify-between gap-8 border-b border-line pb-6">
        <div>
          <p className="text-lg font-semibold">
            {company?.legalName || company?.name}
          </p>
          <p className="text-ink-soft">{company?.address}</p>
          <p className="text-ink-soft">
            {company?.city}, {company?.country}
          </p>
          <p className="text-ink-soft">
            {company?.phone} · {company?.email}
          </p>
          <p className="mt-2 text-ink-faint">
            NINEA {company?.ninea} · RCCM {company?.rccm}
          </p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-semibold tracking-tight">
            Facture {invoice.number}
          </h1>
          <p className="mt-1 text-ink-soft">{STATUS_LABEL[status]}</p>
          <p className="mt-3 text-ink-soft">
            Émise le {formatDate(invoice.issueDate)}
          </p>
          <p className="text-ink-soft">
            Échéance le {formatDate(invoice.dueDate)}
          </p>
        </div>
      </header>

      <section className="mt-6">
        <p className="text-xs uppercase tracking-wide text-ink-faint">
          Facturé à
        </p>
        <p className="mt-1 font-semibold">{client?.companyName}</p>
        <p className="text-ink-soft">{client?.name}</p>
        <p className="text-ink-soft">{client?.address}</p>
        <p className="text-ink-soft">
          {client?.city}, {client?.country}
        </p>
        {invoice.projectName && (
          <p className="mt-3 text-ink-soft">Objet : {invoice.projectName}</p>
        )}
      </section>

      <table className="mt-6 w-full border-collapse text-left">
        <thead>
          <tr className="border-y border-line text-xs uppercase tracking-wide text-ink-faint">
            <th scope="col" className="py-2 font-medium">
              Désignation
            </th>
            <th scope="col" className="py-2 text-right font-medium">
              Qté
            </th>
            <th scope="col" className="py-2 text-right font-medium">
              Prix unitaire
            </th>
            <th scope="col" className="py-2 text-right font-medium">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="border-b border-line">
              <td className="py-2.5 pr-4">
                {item.description}
                {!item.vatApplicable && (
                  <span className="ml-2 text-xs text-ink-faint">
                    exonéré de TVA
                  </span>
                )}
              </td>
              <td className="py-2.5 text-right tabular">{item.quantity}</td>
              <td className="py-2.5 text-right tabular">
                {formatFCFA(item.unitPrice)}
              </td>
              <td className="py-2.5 text-right font-medium tabular">
                {formatFCFA(lineTotal(item))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="ml-auto mt-5 max-w-xs space-y-2">
        <div className="flex justify-between">
          <dt className="text-ink-soft">Sous-total</dt>
          <dd className="tabular">{formatFCFA(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-soft">TVA ({invoice.vatRate}&nbsp;%)</dt>
          <dd className="tabular">{formatFCFA(totals.vat)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-2 text-base">
          <dt className="font-medium">Total</dt>
          <dd className="font-semibold tabular">{formatFCFA(totals.total)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-soft">Déjà encaissé</dt>
          <dd className="tabular">{formatFCFA(invoice.amountPaid)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-soft">Reste à payer</dt>
          <dd className="font-semibold tabular">{formatFCFA(outstanding)}</dd>
        </div>
      </dl>

      {company?.invoiceFooterNote && (
        <footer className="mt-10 border-t border-line pt-4 text-ink-soft">
          {company.invoiceFooterNote}
        </footer>
      )}
    </div>
  );
}
