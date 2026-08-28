import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Paramètres" };

export default function Page() {
  return (
    <ComingSoon
      title="Paramètres"
      description="Informations de l'entreprise, logo et TVA."
    />
  );
}
