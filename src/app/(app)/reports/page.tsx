import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Rapports" };

export default function Page() {
  return (
    <ComingSoon
      title="Rapports"
      description="Chiffre d'affaires, TVA et exports comptables."
    />
  );
}
