import type { Metadata } from "next";

import { InvoiceForm } from "@/components/invoices/invoice-form";
import { nextInvoiceNumber } from "@/lib/data/invoices";

export const metadata: Metadata = { title: "Nouvelle facture" };

export default function Page() {
  return <InvoiceForm nextNumber={nextInvoiceNumber()} />;
}
