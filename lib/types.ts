export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
export type SubscriptionPlan = 'free' | 'pro' | 'business';
export type SubscriptionStatus = 'active' | 'trial' | 'expired';

export interface Profile {
  id: string;
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  company_logo_url: string | null;
  vat_rate: number;
  currency: string;
  ninea_rccm: string | null;
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null;
  updated_at: string;
}

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
