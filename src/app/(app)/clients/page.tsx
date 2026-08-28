import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Clients" };

export default function Page() {
  return (
    <ComingSoon
      title="Clients"
      description="Votre carnet de clients et leur historique."
    />
  );
}
