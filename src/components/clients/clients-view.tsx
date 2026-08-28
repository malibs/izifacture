"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { formatDate, formatFCFA } from "@/lib/format";
import type { ClientStats } from "@/lib/client-stats";
import type { Client } from "@/types";

export interface ClientRow {
  client: Client;
  stats: ClientStats;
}

export function ClientsView({ rows }: { rows: ClientRow[] }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;

    return rows.filter(({ client }) =>
      [client.companyName, client.name, client.email, client.city, client.country]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [rows, query]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Clients"
        description="Vos clients, leur encours et leur historique de facturation."
        actions={
          <Link
            href="/clients/new"
            className={buttonStyles({ variant: "primary", size: "sm" })}
          >
            <Plus className="h-4 w-4" />
            Nouveau client
          </Link>
        }
      />

      <Card className="overflow-hidden">
        <div className="border-b border-line p-4">
          <label className="relative block sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un client…"
              className="h-9 w-full rounded-xl border border-line-strong bg-surface pl-9 pr-3 text-sm placeholder:text-ink-faint focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
          </label>
        </div>

        <div className="sm:hidden">
          {visible.map(({ client, stats }) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="flex items-center gap-3 border-t border-line px-4 py-3.5 active:bg-surface-muted"
            >
              <Avatar
                name={client.companyName}
                color={client.accentColor}
                className="h-9 w-9 text-[11px]"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {client.companyName}
                </p>
                <p className="truncate text-xs text-ink-faint">
                  {client.city}, {client.country}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular">
                {formatFCFA(stats.invoiced)}
              </span>
            </Link>
          ))}
        </div>

        <table className="hidden w-full border-collapse text-left sm:table">
          <thead>
            <tr className="bg-surface-muted text-xs font-medium uppercase tracking-wide text-ink-faint">
              <th scope="col" className="px-5 py-3 font-medium">
                Client
              </th>
              <th scope="col" className="hidden px-5 py-3 font-medium lg:table-cell">
                Contact
              </th>
              <th scope="col" className="px-5 py-3 text-right font-medium">
                Facturé
              </th>
              <th scope="col" className="px-5 py-3 text-right font-medium">
                Encours
              </th>
              <th scope="col" className="hidden px-5 py-3 text-right font-medium md:table-cell">
                Factures
              </th>
              <th scope="col" className="hidden px-5 py-3 font-medium xl:table-cell">
                Dernière émission
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map(({ client, stats }) => (
              <tr
                key={client.id}
                className="border-t border-line transition-colors hover:bg-surface-muted"
              >
                <td className="px-5 py-3.5 text-sm">
                  <Link
                    href={`/clients/${client.id}`}
                    className="flex items-center gap-2.5"
                  >
                    <Avatar
                      name={client.companyName}
                      color={client.accentColor}
                      className="h-7 w-7 text-[10px]"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {client.companyName}
                      </p>
                      <p className="truncate text-xs text-ink-faint">
                        {client.city}, {client.country}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="hidden px-5 py-3.5 text-sm text-ink-soft lg:table-cell">
                  <p>{client.name}</p>
                  <p className="text-xs text-ink-faint">{client.email}</p>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-right text-sm font-medium tabular">
                  {formatFCFA(stats.invoiced)}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-right text-sm tabular">
                  <span
                    className={
                      stats.overdue > 0 ? "text-status-overdue" : "text-ink-soft"
                    }
                  >
                    {formatFCFA(stats.outstanding)}
                  </span>
                </td>
                <td className="hidden px-5 py-3.5 text-right text-sm text-ink-soft tabular md:table-cell">
                  {stats.invoiceCount}
                </td>
                <td className="hidden px-5 py-3.5 text-sm text-ink-soft tabular xl:table-cell">
                  {stats.lastIssueDate ? formatDate(stats.lastIssueDate) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visible.length === 0 && (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-1.5 p-10 text-center">
            <p className="text-base font-medium">Aucun client</p>
            <p className="text-sm text-ink-soft">
              Aucun résultat pour cette recherche.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
