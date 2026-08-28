import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Phone, Plus } from "lucide-react";

import { InvoiceTable } from "@/components/invoices/invoice-table";
import { Avatar } from "@/components/ui/avatar";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getClientStats } from "@/lib/client-stats";
import { getClient, listInvoicesByClient } from "@/lib/queries";
import { formatFCFA } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const client = await getClient(params.id);
  return { title: client?.companyName ?? "Client" };
}

export default async function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const client = await getClient(params.id);
  if (!client) notFound();

  const clientInvoices = await listInvoicesByClient(client.id);
  const stats = getClientStats(clientInvoices);

  const summary = [
    { label: "Total facturé", value: formatFCFA(stats.invoiced) },
    { label: "Encours", value: formatFCFA(stats.outstanding) },
    { label: "En retard", value: formatFCFA(stats.overdue) },
    { label: "Factures", value: String(stats.invoiceCount) },
  ];

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/clients"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Tous les clients
        </Link>
      </div>

      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            name={client.companyName}
            color={client.accentColor}
            className="h-12 w-12 text-sm"
          />
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              {client.companyName}
            </h2>
            <p className="text-sm text-ink-soft">{client.name}</p>
          </div>
        </div>
        <Link
          href="/invoices/new"
          className={buttonStyles({ variant: "primary", size: "sm" })}
        >
          <Plus className="h-4 w-4" />
          Nouvelle facture
        </Link>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="space-y-3 p-5 text-sm">
          <CardTitle>Coordonnées</CardTitle>
          <p className="flex items-center gap-2 text-ink-soft">
            <Mail className="h-4 w-4 text-ink-faint" />
            {client.email}
          </p>
          <p className="flex items-center gap-2 text-ink-soft">
            <Phone className="h-4 w-4 text-ink-faint" />
            {client.phone}
          </p>
          <p className="flex items-start gap-2 text-ink-soft">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
            <span>
              {client.address}
              <br />
              {client.city}, {client.country}
            </span>
          </p>
        </Card>

        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
          {summary.map((item) => (
            <Card key={item.label} className="p-5">
              <p className="text-sm text-ink-soft">{item.label}</p>
              <p className="mt-1.5 text-xl font-semibold tabular">
                {item.value}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Factures du client</CardTitle>
        </CardHeader>
        {clientInvoices.length > 0 ? (
          <InvoiceTable invoices={clientInvoices} clients={[client]} />
        ) : (
          <div className="px-5 pb-6 text-sm text-ink-soft">
            Aucune facture pour ce client.
          </div>
        )}
      </Card>
    </div>
  );
}
