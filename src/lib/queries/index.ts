import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  toClient,
  toInvoice,
  toOrganization,
} from "@/lib/queries/mappers";
import type { Client, Invoice, Organization } from "@/types";

const INVOICE_SELECT = `
  *,
  invoice_items (*),
  created_by_profile:profiles!invoices_created_by_fkey (full_name)
`;

/**
 * Les requêtes ne filtrent pas explicitement par organisation : la RLS s'en
 * charge, ce qui garantit le cloisonnement même en cas d'oubli côté code.
 */
export async function getOrganization(): Promise<Organization | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .maybeSingle();

  if (error) throw error;

  return data ? toOrganization(data) : null;
}

export async function getCurrentProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    fullName: data.full_name ?? user.email ?? "",
    email: user.email ?? "",
    role: data.role,
  };
}

export async function listClients(): Promise<Client[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .is("archived_at", null)
    .order("company_name", { ascending: true });

  if (error) throw error;

  return data.map(toClient);
}

export async function getClient(clientId: string): Promise<Client | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .maybeSingle();

  if (error) throw error;

  return data ? toClient(data) : null;
}

export async function listInvoices(): Promise<Invoice[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select(INVOICE_SELECT)
    .order("issue_date", { ascending: false });

  if (error) throw error;

  return data.map(toInvoice);
}

export async function getInvoice(invoiceId: string): Promise<Invoice | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select(INVOICE_SELECT)
    .eq("id", invoiceId)
    .maybeSingle();

  if (error) throw error;

  return data ? toInvoice(data) : null;
}

export async function listInvoicesByClient(
  clientId: string,
): Promise<Invoice[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select(INVOICE_SELECT)
    .eq("client_id", clientId)
    .order("issue_date", { ascending: false });

  if (error) throw error;

  return data.map(toInvoice);
}
