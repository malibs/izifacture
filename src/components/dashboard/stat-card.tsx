import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  /** Variation en points de pourcentage, positive ou négative. */
  trend?: number;
  accent?: "brand" | "green" | "orange" | "red";
}

const ACCENTS = {
  brand: "bg-brand-50 text-brand-600",
  green: "bg-status-paidSoft text-status-paid",
  orange: "bg-status-sentSoft text-status-sent",
  red: "bg-status-overdueSoft text-status-overdue",
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  accent = "brand",
}: StatCardProps) {
  const positive = (trend ?? 0) >= 0;
  const TrendIcon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            ACCENTS[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        {trend !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-medium",
              positive
                ? "bg-status-paidSoft text-[#067647]"
                : "bg-status-overdueSoft text-[#B42318]",
            )}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {Math.abs(trend)} %
          </span>
        )}
      </div>

      <p className="mt-4 text-sm text-ink-soft">{label}</p>
      <p className="mt-1 text-[26px] font-semibold leading-tight tracking-tight tabular">
        {value}
      </p>
      {hint && <p className="mt-1.5 text-xs text-ink-faint">{hint}</p>}
    </Card>
  );
}
