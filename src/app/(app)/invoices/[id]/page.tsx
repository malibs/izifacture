import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Send } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getClient } from "@/lib/data/clients";
import { company } from "@/lib/data/company";
import { getInvoice, invoices } from "@/lib/data/invoices";
import { daysUntil, formatDate, formatFCFA } from "@/lib/format";
import {
  computeTotals,
  effectiveStatus,
  lineTotal,
  outstandingAmount,
} from "@/lib/invoice-math";

export function generateStaticParams() {
  return invoices.map((invoice) => ({ id: invoice.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const invoice = getInvoice(params.id);
  return { title: invoice?.number ?? "Facture" };
}

function dueLabel(dueDate: string, status: string) {
  if (status === "paid") return "Réglée";
  const days = daysUntil(dueDate);
  if (days < 0) return `${Math.abs(days)} jour(s) de retard`;
  if (days === 0) return "Échéance aujourd'hui";
  return `Dans ${days} jour(s)`;
}

export default function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = getInvoice(params.id);
  if (!invoice) notFound();

  const client = getClient(invoice.clientId);
  const status = effectiveStatus(invoice);
  const totals = computeTotals(invoice.items, invoice.vatRate);
  const outstanding = outstandingAmount(invoice);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/invoices"
            className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Toutes les factures
          </Link>
          <div className="mt-1.5 flex items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              {invoice.number}
            </h2>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-sm text-ink-soft">{invoice.projectName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Download className="h-4 w-4" />
            Télécharger le PDF
          </Button>
          <Button size="sm" variant="primary" disabled={status === "paid"}>
            <Send className="h-4 w-4" />
            Envoyer au client
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-col items-start gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="text-sm">
              <p className="text-base font-semibold">{company.legalName}</p>
              <p className="text-ink-soft">{company.address}</p>
              <p className="text-ink-soft">
                {company.city}, {company.country}
              </p>
              <p className="mt-2 text-ink-faint">
                NINEA {company.ninea} · RCCM {company.rccm}
              </p>
            </div>
            <div className="text-sm sm:text-right">
              <p className="text-xs uppercase tracking-wide text-ink-faint">
                Facturé à
              </p>
              <p className="text-base font-semibold">{client?.companyName}</p>
              <p className="text-ink-soft">{client?.name}</p>
              <p className="text-ink-soft">{client?.address}</p>
              <p className="text-ink-soft">
                {client?.city}, {client?.country}
              </p>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="overflow-hidden rounded-xl border border-line">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-surface-muted text-xs font-medium uppercase tracking-wide text-ink-faint">
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Désignation
                    </th>
                    <th scope="col" className="px-4 py-2.5 text-right font-medium">
                      Qté
                    </th>
                    <th scope="col" className="px-4 py-2.5 text-right font-medium">
                      Prix unitaire
                    </th>
                    <th scope="col" className="px-4 py-2.5 text-right font-medium">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-t border-line">
                      <td className="px-4 py-3">
                        {item.description}
                        {!item.vatApplicable && (
                          <span className="ml-2 text-xs text-ink-faint">
                            exonéré de TVA
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right tabular">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right tabular">
                        {formatFCFA(item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium tabular">
                        {formatFCFA(lineTotal(item))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <dl className="ml-auto mt-4 max-w-xs space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Sous-total</dt>
                <dd className="tabular">{formatFCFA(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">
                  TVA ({invoice.vatRate}&nbsp;%)
                </dt>
                <dd className="tabular">{formatFCFA(totals.vat)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2.5 text-base">
                <dt className="font-medium">Total</dt>
                <dd className="font-semibold tabular">
                  {formatFCFA(totals.total)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Règlement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-soft">Déjà encaissé</span>
                <span className="font-medium tabular">
                  {formatFCFA(invoice.amountPaid)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Reste à percevoir</span>
                <span className="font-semibold tabular">
                  {formatFCFA(outstanding)}
                </span>
              </div>
              <div className="flex justify-between border-t border-line pt-3">
                <span className="text-ink-soft">Émise le</span>
                <span className="tabular">{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Échéance</span>
                <span className="tabular">{formatDate(invoice.dueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Délai</span>
                <span
                  className={
                    status === "overdue" ? "text-status-overdue" : undefined
                  }
                >
                  {dueLabel(invoice.dueDate, status)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Responsable</span>
                <span>{invoice.owner}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Avatar
                  name={client?.companyName ?? "?"}
                  color={client?.accentColor}
                  className="h-10 w-10"
                />
                <div className="min-w-0">
                  <p className="truncate font-medium">{client?.companyName}</p>
                  <p className="truncate text-ink-faint">{client?.email}</p>
                </div>
              </div>
              <p className="text-ink-soft">{client?.phone}</p>
              {client && (
                <Link
                  href={`/clients/${client.id}`}
                  className={buttonStyles({ size: "sm", className: "w-full justify-center" })}
                >
                  Voir la fiche client
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
