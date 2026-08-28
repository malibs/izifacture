export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type PaymentMethod =
  | "mobile_money"
  | "bank_transfer"
  | "cash"
  | "cheque";

export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  accentColor: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  /** Prix unitaire en FCFA (entier). */
  unitPrice: number;
  vatApplicable: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  projectName: string;
  status: InvoiceStatus;
  /** Format ISO `YYYY-MM-DD`. */
  issueDate: string;
  dueDate: string;
  /** Taux de TVA en pourcentage (18 = 18 %). */
  vatRate: number;
  items: InvoiceItem[];
  /** Montant déjà encaissé, en FCFA (entier). */
  amountPaid: number;
  owner: string;
}

export interface Organization {
  id: string;
  name: string;
  legalName: string;
  address: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  ninea: string;
  rccm: string;
  currency: string;
  /** Taux de TVA appliqué par défaut aux nouvelles factures. */
  defaultVatRate: number;
  invoicePrefix: string;
  paymentTermsDays: number;
  invoiceFooterNote: string;
}

export interface InvoiceTotals {
  subtotal: number;
  vat: number;
  total: number;
}
