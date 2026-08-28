import type { Metadata } from "next";

import { ClientForm } from "@/components/clients/client-form";

export const metadata: Metadata = { title: "Nouveau client" };

export default function Page() {
  return <ClientForm />;
}
