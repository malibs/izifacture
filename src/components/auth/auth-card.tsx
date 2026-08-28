import Link from "next/link";

import { Card } from "@/components/ui/card";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <Link href="/" className="flex items-center justify-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white">
          B
        </span>
        <span className="text-lg font-semibold tracking-tight">Baraka</span>
      </Link>

      <Card className="p-6">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-ink-soft">{description}</p>
        <div className="mt-5">{children}</div>
      </Card>

      <p className="text-center text-sm text-ink-soft">{footer}</p>
    </div>
  );
}
