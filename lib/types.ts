export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  client_id: string;
  client_name: string; // Denormalized for easy display in mocks
  invoice_number: string;
  date_issue: string;
  date_due: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  vat: number;
  total: number;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}
