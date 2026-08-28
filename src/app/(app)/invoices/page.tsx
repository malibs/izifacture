import type { Metadata } from "next";

import { InvoicesView } from "@/components/invoices/invoices-view";
import { invoices } from "@/lib/data/invoices";

export const metadata: Metadata = { title: "Factures" };

export default function Page() {
  return <InvoicesView invoices={invoices} />;
}
