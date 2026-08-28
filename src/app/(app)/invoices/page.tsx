import type { Metadata } from "next";

import { InvoicesView } from "@/components/invoices/invoices-view";
import { listClients, listInvoices } from "@/lib/queries";

export const metadata: Metadata = { title: "Factures" };

export default async function Page() {
  const [invoices, clients] = await Promise.all([
    listInvoices(),
    listClients(),
  ]);

  return <InvoicesView invoices={invoices} clients={clients} />;
}
