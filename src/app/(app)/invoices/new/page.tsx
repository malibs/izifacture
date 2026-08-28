import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { InvoiceForm } from "@/components/invoices/invoice-form";
import { getOrganization, listClients } from "@/lib/queries";

export const metadata: Metadata = { title: "Nouvelle facture" };

export default async function Page() {
  const [clients, organization] = await Promise.all([
    listClients(),
    getOrganization(),
  ]);

  if (!organization) redirect("/login");

  return (
    <InvoiceForm
      /* Le numéro définitif est attribué en transaction à l'enregistrement. */
      nextNumber={`${organization.invoicePrefix}-…`}
      clients={clients}
      defaultVatRate={organization.defaultVatRate}
      paymentTermsDays={organization.paymentTermsDays}
    />
  );
}
