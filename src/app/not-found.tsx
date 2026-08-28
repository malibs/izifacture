import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-muted px-5 text-center">
      <p className="text-sm font-medium text-brand-600">Erreur 404</p>
      <h1 className="text-2xl font-semibold tracking-tight">
        Cette page n&apos;existe pas
      </h1>
      <p className="max-w-md text-sm text-ink-soft">
        Le lien est peut-être erroné ou la facture a été supprimée.
      </p>
      <Link href="/dashboard" className={buttonStyles({ variant: "primary" })}>
        Retour au tableau de bord
      </Link>
    </main>
  );
}
