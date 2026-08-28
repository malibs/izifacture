import type { Metadata } from "next";

import { ClientsView } from "@/components/clients/clients-view";
import { getClientStats } from "@/lib/client-stats";
import { clients } from "@/lib/data/clients";

export const metadata: Metadata = { title: "Clients" };

export default function Page() {
  const rows = clients.map((client) => ({
    client,
    stats: getClientStats(client.id),
  }));

  return <ClientsView rows={rows} />;
}
