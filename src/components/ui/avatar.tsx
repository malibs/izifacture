import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

export function Avatar({
  name,
  color,
  className,
}: {
  name: string;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
        !color && "bg-brand-500",
        className,
      )}
      style={color ? { backgroundColor: color } : undefined}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
