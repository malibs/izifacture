import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Factures" };

export default function Page() {
  return (
    <ComingSoon
      title="Factures"
      description="Toutes vos factures, filtres et actions groupées."
    />
  );
}
