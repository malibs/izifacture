import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "icon";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-ink text-white hover:bg-ink/90 focus-visible:outline-ink shadow-card",
  secondary:
    "bg-brand-500 text-white hover:bg-brand-600 focus-visible:outline-brand-500 shadow-card",
  outline:
    "border border-line-strong bg-surface text-ink hover:bg-surface-muted focus-visible:outline-brand-500",
  ghost: "text-ink-soft hover:bg-surface-sunken hover:text-ink",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-3 text-[13px]",
  md: "h-10 gap-2 px-4 text-sm",
  icon: "h-9 w-9 justify-center",
};

const BASE = [
  "inline-flex items-center rounded-xl font-medium transition-colors",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
  "disabled:pointer-events-none disabled:opacity-50",
].join(" ");

/** Styles de bouton applicables à un élément non-`button` (ex. `next/link`). */
export function buttonStyles({
  variant = "outline",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant = "outline", size = "md", ...props }, ref) {
    return (
      <button
        ref={ref}
        className={buttonStyles({ variant, size, className })}
        {...props}
      />
    );
  },
);
