import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Trésorerie" };

export default function Page() {
  return (
    <ComingSoon
      title="Trésorerie"
      description="Entrées et sorties prévisionnelles."
    />
  );
}
