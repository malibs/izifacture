"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Plus, Search } from "lucide-react";

import { InvoiceTable } from "@/components/invoices/invoice-table";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { formatFCFA } from "@/lib/format";
import { effectiveStatus, invoiceTotal } from "@/lib/invoice-math";
import { cn } from "@/lib/utils";
import type { Client, Invoice, InvoiceStatus } from "@/types";

type Filter = "all" | InvoiceStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "draft", label: "Brouillons" },
  { value: "sent", label: "Envoyées" },
  { value: "paid", label: "Payées" },
  { value: "overdue", label: "En retard" },
];

function matchesSearch(invoice: Invoice, client: Client | undefined, query: string) {
  const haystack = [
    invoice.number,
    invoice.projectName,
    invoice.owner,
    client?.companyName,
    client?.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.trim().toLowerCase());
}

export function InvoicesView({
  invoices,
  clients,
}: {
  invoices: Invoice[];
  clients: Client[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const byId = useMemo(
    () => new Map(clients.map((client) => [client.id, client])),
    [clients],
  );

  const counts = useMemo(() => {
    const base: Record<Filter, number> = {
      all: invoices.length,
      draft: 0,
      sent: 0,
      paid: 0,
      overdue: 0,
    };
    for (const invoice of invoices) {
      base[effectiveStatus(invoice)] += 1;
    }
    return base;
  }, [invoices]);

  const visible = useMemo(() => {
    return invoices
      .filter(
        (invoice) => filter === "all" || effectiveStatus(invoice) === filter,
      )
      .filter((invoice) =>
        matchesSearch(invoice, byId.get(invoice.clientId), query),
      )
      .sort((a, b) => b.issueDate.localeCompare(a.issueDate));
  }, [invoices, filter, query, byId]);

  const visibleTotal = visible.reduce(
    (sum, invoice) => sum + invoiceTotal(invoice),
    0,
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Factures"
        description="Suivez l'émission, l'envoi et l'encaissement de vos factures."
        actions={
          <>
            <Button size="sm">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Link
              href="/invoices/new"
              className={buttonStyles({ variant: "primary", size: "sm" })}
            >
              <Plus className="h-4 w-4" />
              Nouvelle facture
            </Link>
          </>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                  filter === item.value
                    ? "bg-ink text-white"
                    : "text-ink-soft hover:bg-surface-sunken",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "tabular text-xs",
                    filter === item.value ? "text-white/70" : "text-ink-faint",
                  )}
                >
                  {counts[item.value]}
                </span>
              </button>
            ))}
          </div>

          <label className="relative lg:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher une facture, un client…"
              className="h-9 w-full rounded-xl border border-line-strong bg-surface pl-9 pr-3 text-sm placeholder:text-ink-faint focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
          </label>
        </div>

        {visible.length > 0 ? (
          <>
            <InvoiceTable invoices={visible} clients={clients} />
            <div className="flex items-center justify-between border-t border-line px-5 py-3 text-sm text-ink-soft">
              <span>
                {visible.length} facture{visible.length > 1 ? "s" : ""}
              </span>
              <span className="font-medium text-ink tabular">
                {formatFCFA(visibleTotal)}
              </span>
            </div>
          </>
        ) : (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-1.5 p-10 text-center">
            <p className="text-base font-medium">Aucune facture</p>
            <p className="max-w-sm text-sm text-ink-soft">
              Aucun résultat pour ces critères. Modifiez le filtre ou la
              recherche.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
