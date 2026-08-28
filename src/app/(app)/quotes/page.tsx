import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Devis" };

export default function Page() {
  return (
    <ComingSoon
      title="Devis"
      description="Vos devis en cours et leur conversion en factures."
    />
  );
}
