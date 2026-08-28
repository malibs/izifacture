import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@/types";

const STATUS_STYLES: Record<
  InvoiceStatus,
  { label: string; dot: string; chip: string }
> = {
  paid: {
    label: "Payée",
    dot: "bg-status-paid",
    chip: "bg-status-paidSoft text-[#067647]",
  },
  sent: {
    label: "Envoyée",
    dot: "bg-status-sent",
    chip: "bg-status-sentSoft text-[#B54708]",
  },
  draft: {
    label: "Brouillon",
    dot: "bg-status-draft",
    chip: "bg-status-draftSoft text-ink-soft",
  },
  overdue: {
    label: "En retard",
    dot: "bg-status-overdue",
    chip: "bg-status-overdueSoft text-[#B42318]",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: InvoiceStatus;
  className?: string;
}) {
  const style = STATUS_STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        style.chip,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {style.label}
    </span>
  );
}

export const statusLabel = (status: InvoiceStatus) => STATUS_STYLES[status].label;
