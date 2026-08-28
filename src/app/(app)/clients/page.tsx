import type { Metadata } from "next";

import { ClientsView } from "@/components/clients/clients-view";
import { getClientStats } from "@/lib/client-stats";
import { listClients, listInvoices } from "@/lib/queries";

export const metadata: Metadata = { title: "Clients" };

export default async function Page() {
  const [clients, invoices] = await Promise.all([
    listClients(),
    listInvoices(),
  ]);

  const rows = clients.map((client) => ({
    client,
    stats: getClientStats(
      invoices.filter((invoice) => invoice.clientId === client.id),
    ),
  }));

  return <ClientsView rows={rows} />;
}
