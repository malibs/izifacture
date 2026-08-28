"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="mx-auto max-w-lg p-8 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-status-overdueSoft text-status-overdue">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h1 className="mt-4 text-lg font-semibold tracking-tight">
        Une erreur est survenue
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Vos données n&apos;ont pas été modifiées. Vérifiez votre connexion puis
        réessayez.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-ink-faint">Référence : {error.digest}</p>
      )}
      <Button className="mt-6" variant="primary" onClick={reset}>
        Réessayer
      </Button>
    </Card>
  );
}
