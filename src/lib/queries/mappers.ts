import type { Database } from "@/types/database";
import type { Client, Invoice, InvoiceItem, Organization } from "@/types";

type ClientRow = Database["public"]["Tables"]["clients"]["Row"];
type InvoiceRow = Database["public"]["Tables"]["invoices"]["Row"];
type InvoiceItemRow = Database["public"]["Tables"]["invoice_items"]["Row"];
type OrganizationRow = Database["public"]["Tables"]["organizations"]["Row"];

/** Palette d'avatars : dérivée de l'identifiant pour rester stable dans le temps. */
const ACCENTS = [
  "#7C5CFC",
  "#12B76A",
  "#F79009",
  "#2E90FA",
  "#F04438",
  "#7A5AF8",
  "#0BA5EC",
  "#DD2590",
];

export function accentFor(id: string) {
  let hash = 0;
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) % 100000;
  }

  return ACCENTS[hash % ACCENTS.length];
}

export function toClient(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    companyName: row.company_name ?? row.name,
    email: row.email ?? "",
    phone: row.phone ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    country: row.country ?? "",
    accentColor: accentFor(row.id),
  };
}

export function toInvoiceItem(row: InvoiceItemRow): InvoiceItem {
  return {
    id: row.id,
    description: row.description,
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
    vatApplicable: row.vat_applicable,
  };
}

/**
 * Le statut « en retard » n'est pas stocké : il est dérivé de l'échéance côté
 * base (vue `invoices_with_status`) comme côté application.
 */
export function toInvoice(
  row: InvoiceRow & {
    invoice_items: InvoiceItemRow[];
    created_by_profile?: { full_name: string | null } | null;
  },
): Invoice {
  return {
    id: row.id,
    number: row.number,
    clientId: row.client_id,
    projectName: row.project_name ?? "",
    status: row.status === "cancelled" ? "draft" : row.status,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    vatRate: Number(row.vat_rate),
    amountPaid: Number(row.amount_paid),
    owner: row.created_by_profile?.full_name ?? "",
    items: [...row.invoice_items]
      .sort((a, b) => a.position - b.position)
      .map(toInvoiceItem),
  };
}

export function toOrganization(row: OrganizationRow): Organization {
  return {
    id: row.id,
    name: row.name,
    legalName: row.legal_name ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    country: row.country,
    email: row.email ?? "",
    phone: row.phone ?? "",
    ninea: row.ninea ?? "",
    rccm: row.rccm ?? "",
    currency: row.currency,
    defaultVatRate: Number(row.default_vat_rate),
    invoicePrefix: row.invoice_prefix,
    paymentTermsDays: row.payment_terms_days,
    invoiceFooterNote: row.invoice_footer_note ?? "",
  };
}
