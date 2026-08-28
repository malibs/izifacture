import { Card } from "@/components/ui/card";
import { formatFCFA, formatPercent } from "@/lib/format";
import type { DashboardStats } from "@/lib/dashboard";

export function CollectionCard({ stats }: { stats: DashboardStats }) {
  const pendingRatio = 1 - stats.paidRatio;

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink-soft">Recouvrement</p>
          <p className="mt-1 text-[26px] font-semibold leading-tight tracking-tight tabular">
            {formatFCFA(stats.totalInvoiced)}
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            Total facturé sur la période
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
          <div>
            <dt className="flex items-center gap-1.5 text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Encaissé
            </dt>
            <dd className="mt-0.5 font-semibold tabular">
              {formatFCFA(stats.totalPaid)}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-status-sent" />
              En attente
            </dt>
            <dd className="mt-0.5 font-semibold tabular">
              {formatFCFA(stats.totalPending)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-5 flex h-3 w-full gap-1 overflow-hidden rounded-full bg-surface-sunken">
        <div
          className="h-full rounded-full bg-brand-500"
          style={{ width: `${stats.paidRatio * 100}%` }}
        />
        <div
          className="h-full rounded-full bg-status-sent/70"
          style={{ width: `${pendingRatio * 100}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-ink-faint">
        <span>{formatPercent(stats.paidRatio)} encaissé</span>
        <span>
          {formatFCFA(stats.totalOverdue)} en retard
        </span>
      </div>
    </Card>
  );
}
