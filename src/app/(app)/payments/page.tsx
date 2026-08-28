import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Paiements" };

export default function Page() {
  return (
    <ComingSoon
      title="Paiements"
      description="Les encaissements et leur rapprochement."
    />
  );
}
