"use client";

import { useEffect } from "react";

/**
 * Ouvre la boîte d'impression du navigateur (« Enregistrer au format PDF »)
 * dès que la page imprimable est affichée.
 */
export function PrintTrigger() {
  useEffect(() => {
    const timer = window.setTimeout(() => window.print(), 400);
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
