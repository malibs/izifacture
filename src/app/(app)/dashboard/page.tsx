import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Clock3,
  Download,
  FileText,
  Plus,
  Wallet,
} from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CollectionCard } from "@/components/dashboard/collection-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { InvoiceTable } from "@/components/invoices/invoice-table";
import {
  getDashboardStats,
  getMonthlySeries,
  getRecentInvoices,
} from "@/lib/dashboard";
import { currentUser } from "@/lib/data/company";
import { formatFCFA } from "@/lib/format";
import { statusLabel } from "@/components/ui/status-badge";
import type { InvoiceStatus } from "@/types";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

const STATUS_ORDER: InvoiceStatus[] = ["draft", "sent", "paid", "overdue"];

const STATUS_DOTS: Record<InvoiceStatus, string> = {
  draft: "bg-status-draft",
  sent: "bg-status-sent",
  paid: "bg-status-paid",
  overdue: "bg-status-overdue",
};

export default function DashboardPage() {
  const stats = getDashboardStats();
  const series = getMonthlySeries();
  const recent = getRecentInvoices();

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Bonjour ${currentUser.fullName.split(" ")[0]}`}
        description="Voici l'état de votre facturation aujourd'hui."
        actions={
          <>
            <Button variant="outline" size="md">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Button variant="primary" size="md">
              <Plus className="h-4 w-4" />
              Nouvelle facture
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Factures émises"
          value={String(stats.invoiceCount)}
          hint={`${stats.countByStatus.draft} brouillon${stats.countByStatus.draft > 1 ? "s" : ""} en cours`}
          icon={FileText}
          accent="brand"
          trend={12}
        />
        <StatCard
          label="Montant facturé"
          value={formatFCFA(stats.totalInvoiced)}
          hint="Hors brouillons"
          icon={Wallet}
          accent="brand"
          trend={8}
        />
        <StatCard
          label="Montant payé"
          value={formatFCFA(stats.totalPaid)}
          hint={`${stats.countByStatus.paid} factures réglées`}
          icon={Wallet}
          accent="green"
          trend={5}
        />
        <StatCard
          label="Montant en attente"
          value={formatFCFA(stats.totalPending)}
          hint={`dont ${formatFCFA(stats.totalOverdue)} en retard`}
          icon={Clock3}
          accent="orange"
          trend={-3}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex flex-col lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Chiffre d&apos;affaires facturé</CardTitle>
              <CardDescription>6 derniers mois, TVA incluse</CardDescription>
            </div>
            <div className="hidden items-center gap-4 text-xs text-ink-soft sm:flex">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                Meilleur mois
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-100" />
                Autres mois
              </span>
            </div>
          </CardHeader>
          <div className="flex-1 px-2 pb-4">
            <RevenueChart data={series} />
          </div>
        </Card>

        <div className="space-y-4">
          <CollectionCard stats={stats} />
          <Card className="p-5">
            <p className="text-sm font-semibold">Répartition par statut</p>
            <ul className="mt-3 space-y-2.5">
              {STATUS_ORDER.map((status) => (
                <li
                  key={status}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="inline-flex items-center gap-2 text-ink-soft">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[status]}`}
                    />
                    {statusLabel(status)}
                  </span>
                  <span className="font-medium tabular">
                    {stats.countByStatus[status]}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Dernières factures</CardTitle>
            <CardDescription>
              Les {recent.length} factures les plus récentes
            </CardDescription>
          </div>
          <Link
            href="/invoices"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Tout voir
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <InvoiceTable invoices={recent} />
      </Card>
    </div>
  );
}
