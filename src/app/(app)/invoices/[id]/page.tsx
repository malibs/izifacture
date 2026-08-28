import { notFound } from "next/navigation";

import { ComingSoon } from "@/components/layout/coming-soon";
import { invoices } from "@/lib/data/invoices";

export function generateStaticParams() {
  return invoices.map((invoice) => ({ id: invoice.id }));
}

export default function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = invoices.find((item) => item.id === params.id);
  if (!invoice) notFound();

  return (
    <ComingSoon
      title={invoice.number}
      description={`${invoice.projectName} — le détail de la facture arrive à l'étape suivante.`}
    />
  );
}
